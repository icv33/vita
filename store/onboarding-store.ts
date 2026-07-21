/**
 * Onboarding draft store (Zustand).
 *
 * Holds the TEMPORARY questionnaire state (separate from the confirmed profile
 * in the app store). Every mutation updates memory immediately so the UI is
 * instant. Persistence to AsyncStorage is debounced for answer edits (avoids a
 * write per keystroke) and flushed immediately on step navigation, so a single
 * timer is ever in flight — no wasted writes, no races. Progress survives an
 * app close and the flow can resume from `currentStepId`.
 */

import { create } from 'zustand';

import { REVIEW_STEP_ID } from '@/constants';
import { onboardingStorage } from '@/storage';
import type { OnboardingAnswers, OnboardingDraft } from '@/types';
import { createEmptyDraft, nextStepId, prevStepId } from '@/utils/onboarding';

const nowISO = () => new Date().toISOString();
const PERSIST_DELAY_MS = 300;

// Module-level write scheduler: at most one timer / one queued draft at a time.
let writeTimer: ReturnType<typeof setTimeout> | null = null;
let queued: OnboardingDraft | null = null;

function cancelTimer(): void {
  if (writeTimer) {
    clearTimeout(writeTimer);
    writeTimer = null;
  }
}

async function flushQueue(): Promise<void> {
  cancelTimer();
  if (queued) {
    const draft = queued;
    queued = null;
    await onboardingStorage.setDraft(draft);
  }
}

function scheduleWrite(draft: OnboardingDraft): void {
  queued = draft;
  cancelTimer();
  writeTimer = setTimeout(() => {
    void flushQueue();
  }, PERSIST_DELAY_MS);
}

async function writeNow(draft: OnboardingDraft): Promise<void> {
  queued = null;
  cancelTimer();
  await onboardingStorage.setDraft(draft);
}

export type OnboardingStoreState = {
  draft: OnboardingDraft | null;
  /** True once the persisted draft has been read on launch. */
  isHydrated: boolean;
  /** When true, finishing/leaving a step returns to the review screen. */
  returnToReview: boolean;

  hydrateDraft: () => Promise<void>;
  /** Start a brand-new questionnaire, discarding any existing draft. */
  startFresh: () => Promise<OnboardingDraft>;
  /** Ensure a draft exists without discarding an existing one. */
  ensureDraft: () => Promise<OnboardingDraft>;
  /** Merge answers (memory now, disk debounced). */
  setAnswers: (patch: Partial<OnboardingAnswers>) => void;
  /** Advance to the next step (or back to review when editing). */
  goNext: () => Promise<void>;
  /** Go to the previous step (or back to review when editing). */
  goBack: () => Promise<void>;
  /** Jump to a step to edit it, returning to review afterwards. */
  editStep: (stepId: string) => Promise<void>;
  /** Force any pending write to disk now (e.g. on app background). */
  flush: () => Promise<void>;
  /** Clear the draft from memory and storage. */
  resetDraft: () => Promise<void>;
};

export const useOnboardingStore = create<OnboardingStoreState>((set, get) => ({
  draft: null,
  isHydrated: false,
  returnToReview: false,

  hydrateDraft: async () => {
    const draft = await onboardingStorage.getDraft();
    set({ draft, isHydrated: true });
  },

  startFresh: async () => {
    const draft = createEmptyDraft(nowISO());
    set({ draft, returnToReview: false });
    await writeNow(draft);
    return draft;
  },

  ensureDraft: async () => {
    const existing = get().draft;
    if (existing) return existing;
    return get().startFresh();
  },

  setAnswers: (patch) => {
    const current = get().draft ?? createEmptyDraft(nowISO());
    const updated: OnboardingDraft = {
      ...current,
      answers: { ...current.answers, ...patch },
      updatedAt: nowISO(),
    };
    set({ draft: updated });
    scheduleWrite(updated);
  },

  goNext: async () => {
    const { draft, returnToReview } = get();
    if (!draft) return;
    const current = draft.currentStepId;
    const completedStepIds = draft.completedStepIds.includes(current)
      ? draft.completedStepIds
      : [...draft.completedStepIds, current];
    const target = returnToReview ? REVIEW_STEP_ID : nextStepId(current) ?? REVIEW_STEP_ID;
    const updated: OnboardingDraft = {
      ...draft,
      currentStepId: target,
      completedStepIds,
      updatedAt: nowISO(),
    };
    set({ draft: updated, returnToReview: false });
    await writeNow(updated);
  },

  goBack: async () => {
    const { draft, returnToReview } = get();
    if (!draft) return;
    if (returnToReview) {
      const updated = { ...draft, currentStepId: REVIEW_STEP_ID, updatedAt: nowISO() };
      set({ draft: updated, returnToReview: false });
      await writeNow(updated);
      return;
    }
    const prev = prevStepId(draft.currentStepId);
    if (!prev) return;
    const updated = { ...draft, currentStepId: prev, updatedAt: nowISO() };
    set({ draft: updated });
    await writeNow(updated);
  },

  editStep: async (stepId) => {
    const { draft } = get();
    if (!draft) return;
    const updated = { ...draft, currentStepId: stepId, updatedAt: nowISO() };
    set({ draft: updated, returnToReview: true });
    await writeNow(updated);
  },

  flush: async () => {
    await flushQueue();
  },

  resetDraft: async () => {
    cancelTimer();
    queued = null;
    set({ draft: null, returnToReview: false });
    await onboardingStorage.clearDraft();
  },
}));

/** Whether there's a draft worth resuming (some progress made). */
export function isResumable(draft: OnboardingDraft | null): boolean {
  if (!draft) return false;
  return draft.completedStepIds.length > 0 || Object.keys(draft.answers).length > 0;
}

/**
 * Pure onboarding logic — draft lifecycle, step navigation, progress and the
 * draft → profile conversion. No React, no storage, no side effects, so all of
 * it is straightforward to unit test.
 */

import {
  DATA_STEP_IDS,
  EQUIPMENT,
  EQUIPMENT_BY_PLACE,
  FIRST_STEP_ID,
  ONBOARDING_SCHEMA_VERSION,
  ONBOARDING_STEPS,
  REVIEW_STEP_ID,
  type Equipment,
  type OnboardingStepId,
  type OnboardingStepMeta,
  type TrainingPlace,
} from '@/constants';
import type { OnboardingAnswers, OnboardingDraft, TimeString, UserProfile } from '@/types';

const STEP_IDS = ONBOARDING_STEPS.map((s) => s.id) as OnboardingStepId[];

/** Toggle a value in a (possibly undefined) array — pure, for multi-select. */
export function toggleInArray<T>(arr: T[] | undefined, value: T): T[] {
  const list = arr ?? [];
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

/** A fresh, empty draft positioned at the first step. */
export function createEmptyDraft(now: string = new Date().toISOString()): OnboardingDraft {
  return {
    schemaVersion: ONBOARDING_SCHEMA_VERSION,
    currentStepId: FIRST_STEP_ID,
    completedStepIds: [],
    answers: {},
    createdAt: now,
    updatedAt: now,
  };
}

export function stepMetaById(id: string): OnboardingStepMeta | undefined {
  return ONBOARDING_STEPS.find((s) => s.id === id);
}

export function stepIndex(id: string): number {
  return STEP_IDS.indexOf(id as OnboardingStepId);
}

/** The next step in order, or `null` at the end (review). */
export function nextStepId(current: string): OnboardingStepId | null {
  const idx = stepIndex(current);
  if (idx < 0 || idx >= STEP_IDS.length - 1) return null;
  return STEP_IDS[idx + 1];
}

/** The previous step in order, or `null` at the first step. */
export function prevStepId(current: string): OnboardingStepId | null {
  const idx = stepIndex(current);
  if (idx <= 0) return null;
  return STEP_IDS[idx - 1];
}

/** 1-based position among data steps (review reports the last position). */
export function stepNumber(id: string): number {
  const dataIdx = DATA_STEP_IDS.indexOf(id as OnboardingStepId);
  if (dataIdx >= 0) return dataIdx + 1;
  return DATA_STEP_IDS.length; // review
}

/** Total number of data steps shown in "Paso X de N". */
export const TOTAL_DATA_STEPS = DATA_STEP_IDS.length;

/** Completion ratio (0–1) for the progress bar. */
export function stepProgress(id: string): number {
  if (id === REVIEW_STEP_ID) return 1;
  return stepNumber(id) / TOTAL_DATA_STEPS;
}

/**
 * Equipment options available given the chosen places (union, preserving the
 * canonical EQUIPMENT order). Powers the adaptive equipment question.
 */
export function applicableEquipment(places: TrainingPlace[] | undefined): Equipment[] {
  if (!places || places.length === 0) return [];
  const allowed = new Set<Equipment>();
  for (const place of places) {
    for (const item of EQUIPMENT_BY_PLACE[place] ?? []) allowed.add(item);
  }
  return EQUIPMENT.map((e) => e.value).filter((v) => allowed.has(v));
}

/** Whether the target-weight question applies to the chosen goal. */
export function needsTargetWeight(answers: OnboardingAnswers): boolean {
  return answers.primaryGoal === 'lose_fat' || answers.primaryGoal === 'gain_muscle';
}

/** Whether the "which sport/event" free text applies. */
export function needsTargetSport(answers: OnboardingAnswers): boolean {
  return answers.primaryGoal === 'prepare_event';
}

/** Whether the "other diet" free text applies. */
export function needsDietOther(answers: OnboardingAnswers): boolean {
  return answers.dietType === 'other';
}

/** Whether the user has declared any allergies (drives review confirmation). */
export function hasAllergies(answers: OnboardingAnswers): boolean {
  const hasCommon = Array.isArray(answers.allergies) && answers.allergies.length > 0;
  const hasOther = Boolean(answers.otherAllergies && answers.otherAllergies.trim());
  return hasCommon || hasOther;
}

/** Parse "HH:mm" into minutes since midnight, or null if malformed. */
function timeToMinutes(time: TimeString): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time);
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}

/**
 * Approximate sleep duration (hours) between bedtime and wake time, handling the
 * overnight wrap. Returns null if either time is missing/invalid. This is a
 * DERIVED value — it is computed, never stored.
 */
export function sleepHoursBetween(bed?: TimeString, wake?: TimeString): number | null {
  if (!bed || !wake) return null;
  const b = timeToMinutes(bed);
  const w = timeToMinutes(wake);
  if (b == null || w == null) return null;
  let diff = w - b;
  if (diff <= 0) diff += 24 * 60;
  return Math.round((diff / 60) * 10) / 10;
}

/**
 * Convert a completed draft into the final, confirmed profile. `name` is
 * trimmed; timestamps carry over from the draft with a fresh `updatedAt`.
 */
export function draftToProfile(
  draft: OnboardingDraft,
  acknowledgedDisclaimer: boolean,
  now: string = new Date().toISOString(),
): UserProfile {
  return {
    schemaVersion: draft.schemaVersion,
    name: (draft.answers.name ?? '').trim(),
    answers: draft.answers,
    acknowledgedDisclaimer,
    createdAt: draft.createdAt,
    updatedAt: now,
  };
}

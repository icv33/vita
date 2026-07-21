/**
 * Persistence for onboarding state: the completion flag and the in-progress
 * questionnaire draft. Consumed by the stores; the UI never touches it directly.
 */

import { STORAGE_KEYS } from '@/constants';
import type { OnboardingDraft } from '@/types';
import { storage } from './storage';

export const onboardingStorage = {
  async isComplete(): Promise<boolean> {
    return storage.getItem<boolean>(STORAGE_KEYS.onboardingComplete, false);
  },

  async setComplete(complete: boolean): Promise<boolean> {
    return storage.setItem(STORAGE_KEYS.onboardingComplete, complete);
  },

  /** The saved questionnaire draft, or null if none. */
  async getDraft(): Promise<OnboardingDraft | null> {
    return storage.getItem<OnboardingDraft | null>(STORAGE_KEYS.onboardingDraft, null);
  },

  async setDraft(draft: OnboardingDraft): Promise<boolean> {
    return storage.setItem(STORAGE_KEYS.onboardingDraft, draft);
  },

  async clearDraft(): Promise<boolean> {
    return storage.removeItem(STORAGE_KEYS.onboardingDraft);
  },

  /** Dev helper — clears completion flag, draft and profile in one go. */
  async reset(): Promise<boolean> {
    return storage.multiRemove([
      STORAGE_KEYS.onboardingComplete,
      STORAGE_KEYS.onboardingDraft,
      STORAGE_KEYS.userProfile,
    ]);
  },
};

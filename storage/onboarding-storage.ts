/**
 * Persistence for onboarding completion state.
 * Consumed by the app store to gate routing between onboarding and the app.
 */

import { STORAGE_KEYS } from '@/constants';
import { storage } from './storage';

export const onboardingStorage = {
  async isComplete(): Promise<boolean> {
    return storage.getItem<boolean>(STORAGE_KEYS.onboardingComplete, false);
  },

  async setComplete(complete: boolean): Promise<boolean> {
    return storage.setItem(STORAGE_KEYS.onboardingComplete, complete);
  },

  /** Dev helper — clears onboarding + profile so the flow can be re-tested. */
  async reset(): Promise<boolean> {
    return storage.multiRemove([STORAGE_KEYS.onboardingComplete, STORAGE_KEYS.userProfile]);
  },
};

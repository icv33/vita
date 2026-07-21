/**
 * Global app store (Zustand).
 *
 * Holds cross-cutting app state: the onboarding completion gate and the
 * confirmed user profile, both hydrated from AsyncStorage on launch. The
 * temporary questionnaire draft lives separately in the onboarding store.
 */

import { create } from 'zustand';

import { onboardingStorage, profileStorage } from '@/storage';
import type { UserProfile } from '@/types';

export type AppState = {
  /** True until persisted state has been read on launch. */
  isHydrating: boolean;
  /** Whether the user has finished onboarding. */
  hasCompletedOnboarding: boolean;
  /** The confirmed profile (null until onboarding is finished). */
  profile: UserProfile | null;

  /** Read persisted state into the store. Call once at app start. */
  hydrate: () => Promise<void>;
  /** Persist the confirmed profile, mark onboarding complete. */
  completeOnboarding: (profile: UserProfile) => Promise<void>;
};

export const useAppStore = create<AppState>((set) => ({
  isHydrating: true,
  hasCompletedOnboarding: false,
  profile: null,

  hydrate: async () => {
    const [complete, profile] = await Promise.all([
      onboardingStorage.isComplete(),
      profileStorage.get(),
    ]);
    set({ hasCompletedOnboarding: complete, profile, isHydrating: false });
  },

  completeOnboarding: async (profile) => {
    await profileStorage.set(profile);
    await onboardingStorage.setComplete(true);
    set({ hasCompletedOnboarding: true, profile });
  },
}));

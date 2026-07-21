/**
 * Global app store (Zustand).
 *
 * Holds cross-cutting app state. For the base phase this is the onboarding
 * gate: whether the user has completed onboarding, hydrated from AsyncStorage
 * on launch. Feature state (plans, meals, schedule) will get their own slices
 * as those features are built.
 */

import { create } from 'zustand';

import { onboardingStorage } from '@/storage';

export type AppState = {
  /** True until the persisted onboarding flag has been read on launch. */
  isHydrating: boolean;
  /** Whether the user has finished onboarding. */
  hasCompletedOnboarding: boolean;

  /** Read persisted state into the store. Call once at app start. */
  hydrate: () => Promise<void>;
  /** Mark onboarding complete and persist it. */
  completeOnboarding: () => Promise<void>;
  /** Dev helper: clear onboarding + profile and return to the flow. */
  resetOnboarding: () => Promise<void>;
};

export const useAppStore = create<AppState>((set) => ({
  isHydrating: true,
  hasCompletedOnboarding: false,

  hydrate: async () => {
    const complete = await onboardingStorage.isComplete();
    set({ hasCompletedOnboarding: complete, isHydrating: false });
  },

  completeOnboarding: async () => {
    await onboardingStorage.setComplete(true);
    set({ hasCompletedOnboarding: true });
  },

  resetOnboarding: async () => {
    await onboardingStorage.reset();
    set({ hasCompletedOnboarding: false });
  },
}));

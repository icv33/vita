/**
 * Coordinated, atomic reset of the entire onboarding flow.
 *
 * Centralises what used to be split between the screen and the stores so the
 * reset always happens in the correct order and leaves the app exactly like a
 * fresh install. Used by the dev "Reiniciar onboarding" tool (and any future
 * account reset).
 */

import { onboardingStorage, profileStorage } from '@/storage';
import { useAppStore } from './app-store';
import { useCalendarStore } from './calendar-store';
import { useOnboardingStore } from './onboarding-store';

/**
 * Clears every trace of onboarding/profile state (memory + AsyncStorage) and
 * returns both stores to their initial values. Awaits all async work so callers
 * can safely navigate afterwards.
 *
 * Order matters:
 *  1. Reset the draft store first — this cancels any pending debounced write and
 *     clears the in-memory draft, so no stale write can re-persist old data
 *     after we wipe storage.
 *  2. Remove the persisted keys (completion flag, draft, profile).
 *  3. Reset the app store's in-memory state. Hydration flags are kept "done" so
 *     the root layout does not re-hydrate (avoids loops / a blank screen).
 *  4. Clear the calendar too — a full reset simulates a fresh install.
 */
export async function resetEntireOnboardingFlow(): Promise<void> {
  // 1) Draft store: cancel timer + clear memory + remove draft key.
  await useOnboardingStore.getState().resetDraft();

  // 2) Persistence: completion flag + draft + profile.
  await onboardingStorage.reset();
  await profileStorage.clear();

  // 3) In-memory state → fresh install. Hydration stays finished.
  useAppStore.setState({ hasCompletedOnboarding: false, profile: null, isHydrating: false });
  useOnboardingStore.setState({ draft: null, returnToReview: false, isHydrated: true });

  // 4) Calendar: clears schedule + meta from storage and resets its store.
  await useCalendarStore.getState().resetCalendar();
}

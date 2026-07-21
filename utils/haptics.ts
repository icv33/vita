/**
 * Thin, platform-safe wrapper around expo-haptics.
 *
 * Provides light, non-intrusive feedback for meaningful selections in the
 * onboarding flow. No-ops on web and swallows errors so callers never need to
 * guard. (This is the one intentionally side-effectful module under utils/.)
 */

import * as Haptics from 'expo-haptics';

const isNative = process.env.EXPO_OS === 'ios' || process.env.EXPO_OS === 'android';

/** Light feedback for toggles / option selections. */
export function hapticSelect(): void {
  if (!isNative) return;
  Haptics.selectionAsync().catch(() => {});
}

/** Slightly stronger feedback for confirmations / step completion. */
export function hapticImpact(): void {
  if (!isNative) return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

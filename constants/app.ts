/**
 * App-wide constants for Vita.
 */

export const APP_NAME = 'Vita';
export const APP_TAGLINE = 'Tu plan. Tu tiempo. Tu cambio.';

/** Namespaced AsyncStorage keys. Centralised to avoid typos and collisions. */
export const STORAGE_KEYS = {
  onboardingComplete: 'vita:onboarding:complete',
  onboardingDraft: 'vita:onboarding:draft',
  userProfile: 'vita:user:profile',
  calendarSchedule: 'vita:calendar:schedule',
  calendarMeta: 'vita:calendar:meta',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

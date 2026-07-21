/**
 * Fixed component sizing tokens (heights, icon sizes, hit slop).
 * Keeps interactive elements consistent and above the accessible minimum.
 */

export const sizes = {
  // Control heights
  buttonSm: 40,
  buttonMd: 48,
  buttonLg: 56,
  fieldHeight: 52,

  // Icons
  iconXs: 14,
  iconSm: 18,
  iconMd: 22,
  iconLg: 28,
  iconXl: 36,

  // Misc
  avatarSm: 32,
  avatarMd: 44,
  avatarLg: 64,
  tabBarHeight: 56,
  progressBarHeight: 8,
} as const;

export type SizeToken = keyof typeof sizes;

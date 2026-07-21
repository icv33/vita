/**
 * Spacing scale (in points). Based on a 4pt grid so layouts stay rhythmic.
 * Use these tokens for padding, margin and gap instead of magic numbers.
 */

export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  giant: 56,
} as const;

export type SpacingToken = keyof typeof spacing;

/**
 * Minimum touch target recommended by Apple HIG / Material for accessible,
 * comfortable tap zones. Interactive components should honor this.
 */
export const MIN_TOUCH_TARGET = 44;

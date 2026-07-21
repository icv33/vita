/**
 * Vita design system — single entry point.
 *
 * Import tokens from here: `import { spacing, radii } from '@/theme'`.
 * For theme-aware colors in components, use the `useTheme` hook.
 */

export { palette } from './palette';
export { colors, lightColors, darkColors } from './colors';
export type { ThemeColors, ColorSchemeName } from './colors';
export { spacing, MIN_TOUCH_TARGET } from './spacing';
export type { SpacingToken } from './spacing';
export { radii } from './radii';
export type { RadiusToken } from './radii';
export { typography, fontFamily, fontWeight } from './typography';
export type { TextVariant } from './typography';
export { shadows } from './shadows';
export type { ShadowToken } from './shadows';
export { sizes } from './sizes';
export type { SizeToken } from './sizes';
export { icons } from './icons';
export type { IconName } from './icons';

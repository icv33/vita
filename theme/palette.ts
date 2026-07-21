/**
 * Raw color palette for Vita.
 *
 * These are the primitive color values. They are not consumed directly by
 * components — instead they feed the semantic `colors` in `./colors.ts`, which
 * maps them to light and dark themes. Keep raw hex values only in this file.
 */

export const palette = {
  // Brand — Vita blue (primary actions) and green (health / success accent).
  blue50: '#EDF1FF',
  blue100: '#D6E0FF',
  blue200: '#AEC0FF',
  blue300: '#7E97FF',
  blue400: '#5273FF',
  blue500: '#2E5BFF', // primary
  blue600: '#1F44D6',
  blue700: '#1835A8',

  green50: '#E9FBF0',
  green100: '#C8F5D8',
  green200: '#8FE9B0',
  green300: '#4FD98A',
  green400: '#25C56E',
  green500: '#16A34A', // accent / success
  green600: '#128040',
  green700: '#0D5F30',

  // Neutrals — warm-tinted grays for a soft, modern feel.
  white: '#FFFFFF',
  gray50: '#F6F7F9',
  gray100: '#EEF0F3',
  gray200: '#E2E5EA',
  gray300: '#CBD0D8',
  gray400: '#9AA1AD',
  gray500: '#6B7280',
  gray600: '#4B5159',
  gray700: '#343A40',
  gray800: '#1F2429',
  gray900: '#12161A',
  black: '#0A0D0F',

  // Feedback
  red500: '#E5484D',
  amber500: '#F5A524',
} as const;

export type PaletteColor = keyof typeof palette;

/**
 * Semantic colors for Vita, mapped to light and dark themes.
 *
 * Components must always read from here (via `useTheme`) rather than importing
 * raw palette values, so that theming stays consistent. Light is the default
 * and most polished theme; dark is prepared and functional.
 */

import { palette } from './palette';

export type ThemeColors = {
  // Surfaces
  background: string;
  surface: string;
  surfaceAlt: string;
  card: string;
  border: string;
  overlay: string;

  // Content
  text: string;
  textMuted: string;
  textSubtle: string;
  textInverted: string;

  // Brand
  primary: string;
  primaryMuted: string;
  onPrimary: string;
  accent: string;
  accentMuted: string;
  onAccent: string;

  // Feedback
  success: string;
  danger: string;
  dangerMuted: string;
  warning: string;

  // Navigation
  tabBar: string;
  tabIconDefault: string;
  tabIconSelected: string;
};

export const lightColors: ThemeColors = {
  background: palette.gray50,
  surface: palette.white,
  surfaceAlt: palette.gray100,
  card: palette.white,
  border: palette.gray200,
  overlay: 'rgba(10, 13, 15, 0.45)',

  text: palette.gray900,
  textMuted: palette.gray500,
  textSubtle: palette.gray400,
  textInverted: palette.white,

  primary: palette.blue500,
  primaryMuted: palette.blue50,
  onPrimary: palette.white,
  accent: palette.green500,
  accentMuted: palette.green50,
  onAccent: palette.white,

  success: palette.green500,
  danger: palette.red500,
  dangerMuted: 'rgba(229, 72, 77, 0.10)',
  warning: palette.amber500,

  tabBar: palette.white,
  tabIconDefault: palette.gray400,
  tabIconSelected: palette.blue500,
};

export const darkColors: ThemeColors = {
  background: palette.gray900,
  surface: palette.gray800,
  surfaceAlt: palette.gray700,
  card: palette.gray800,
  border: palette.gray700,
  overlay: 'rgba(0, 0, 0, 0.6)',

  text: palette.gray50,
  textMuted: palette.gray400,
  textSubtle: palette.gray500,
  textInverted: palette.gray900,

  primary: palette.blue400,
  primaryMuted: 'rgba(46, 91, 255, 0.16)',
  onPrimary: palette.white,
  accent: palette.green400,
  accentMuted: 'rgba(22, 163, 74, 0.18)',
  onAccent: palette.white,

  success: palette.green400,
  danger: palette.red500,
  dangerMuted: 'rgba(229, 72, 77, 0.16)',
  warning: palette.amber500,

  tabBar: palette.gray800,
  tabIconDefault: palette.gray500,
  tabIconSelected: palette.blue400,
};

export const colors = {
  light: lightColors,
  dark: darkColors,
} as const;

export type ColorSchemeName = keyof typeof colors;

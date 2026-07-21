/**
 * Adapters that map Vita's color tokens onto React Navigation's theme shape,
 * so navigator chrome (headers, backgrounds) matches the design system.
 */

import { DarkTheme, DefaultTheme, type Theme as NavTheme } from '@react-navigation/native';

import { darkColors, lightColors } from './colors';

export const navLightTheme: NavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: lightColors.primary,
    background: lightColors.background,
    card: lightColors.surface,
    text: lightColors.text,
    border: lightColors.border,
    notification: lightColors.accent,
  },
};

export const navDarkTheme: NavTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: darkColors.primary,
    background: darkColors.background,
    card: darkColors.surface,
    text: darkColors.text,
    border: darkColors.border,
    notification: darkColors.accent,
  },
};

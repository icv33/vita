/**
 * `useTheme` — the primary way components read design tokens.
 *
 * Returns the active color scheme's semantic colors plus the static token
 * scales. It follows the OS appearance (light / dark) and falls back to light,
 * which is Vita's primary, most-polished theme.
 */

import { useMemo } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  colors,
  radii,
  shadows,
  sizes,
  spacing,
  typography,
  type ColorSchemeName,
  type ThemeColors,
} from '@/theme';

export type Theme = {
  scheme: ColorSchemeName;
  isDark: boolean;
  colors: ThemeColors;
  spacing: typeof spacing;
  radii: typeof radii;
  typography: typeof typography;
  shadows: typeof shadows;
  sizes: typeof sizes;
};

export function useTheme(): Theme {
  const scheme: ColorSchemeName = useColorScheme() === 'dark' ? 'dark' : 'light';

  return useMemo(
    () => ({
      scheme,
      isDark: scheme === 'dark',
      colors: colors[scheme],
      spacing,
      radii,
      typography,
      shadows,
      sizes,
    }),
    [scheme],
  );
}

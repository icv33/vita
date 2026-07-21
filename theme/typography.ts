/**
 * Typography scale for Vita.
 *
 * Uses the platform system font (San Francisco on iOS) for a native feel and
 * zero font-loading cost — important for fast, reliable Expo Go startup.
 * Each variant defines size, line height and weight; components consume these
 * through the `Text` primitive via the `variant` prop.
 */

import { Platform, type TextStyle } from 'react-native';

export const fontFamily = Platform.select({
  ios: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  default: {
    regular: 'sans-serif',
    medium: 'sans-serif-medium',
    semibold: 'sans-serif-medium',
    bold: 'sans-serif',
  },
}) as Record<'regular' | 'medium' | 'semibold' | 'bold', string>;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const satisfies Record<string, TextStyle['fontWeight']>;

export type TextVariant =
  | 'display'
  | 'title'
  | 'heading'
  | 'subheading'
  | 'body'
  | 'bodyStrong'
  | 'callout'
  | 'label'
  | 'caption';

type VariantStyle = Pick<TextStyle, 'fontSize' | 'lineHeight' | 'fontWeight' | 'letterSpacing'>;

export const typography: Record<TextVariant, VariantStyle> = {
  display: { fontSize: 34, lineHeight: 40, fontWeight: fontWeight.bold, letterSpacing: -0.5 },
  title: { fontSize: 28, lineHeight: 34, fontWeight: fontWeight.bold, letterSpacing: -0.4 },
  heading: { fontSize: 22, lineHeight: 28, fontWeight: fontWeight.semibold, letterSpacing: -0.2 },
  subheading: { fontSize: 18, lineHeight: 24, fontWeight: fontWeight.semibold },
  body: { fontSize: 16, lineHeight: 24, fontWeight: fontWeight.regular },
  bodyStrong: { fontSize: 16, lineHeight: 24, fontWeight: fontWeight.semibold },
  callout: { fontSize: 15, lineHeight: 20, fontWeight: fontWeight.regular },
  label: { fontSize: 14, lineHeight: 18, fontWeight: fontWeight.medium },
  caption: { fontSize: 13, lineHeight: 16, fontWeight: fontWeight.regular },
};

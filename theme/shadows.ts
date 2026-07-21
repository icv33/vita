/**
 * Elevation / shadow tokens.
 *
 * Uses iOS `shadow*` props plus Android `elevation` so cards feel native on
 * both platforms. Values are intentionally soft to match Vita's calm look.
 */

import { Platform, type ViewStyle } from 'react-native';

type Shadow = Pick<
  ViewStyle,
  'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'
>;

const shadowColor = '#0A0D0F';

function make(offsetY: number, radius: number, opacity: number, elevation: number): Shadow {
  return Platform.select({
    ios: {
      shadowColor,
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
    android: { elevation },
    default: {},
  }) as Shadow;
}

export const shadows = {
  none: Platform.select({ android: { elevation: 0 }, default: {} }) as Shadow,
  sm: make(1, 3, 0.06, 1),
  md: make(4, 10, 0.08, 3),
  lg: make(8, 20, 0.1, 6),
} as const;

export type ShadowToken = keyof typeof shadows;

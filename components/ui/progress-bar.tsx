/**
 * ProgressBar — a horizontal track showing a 0–1 completion ratio.
 * Used for onboarding step progress and adherence indicators.
 */

import { View, type ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { clamp } from '@/utils';

export type ProgressBarProps = {
  /** Completion ratio, 0–1. */
  progress: number;
  color?: string;
  trackColor?: string;
  height?: number;
  style?: ViewStyle;
};

export function ProgressBar({ progress, color, trackColor, height, style }: ProgressBarProps) {
  const theme = useTheme();
  const ratio = clamp(progress, 0, 1);
  const h = height ?? theme.sizes.progressBarHeight;

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(ratio * 100) }}
      style={[
        {
          height: h,
          borderRadius: theme.radii.pill,
          backgroundColor: trackColor ?? theme.colors.surfaceAlt,
          overflow: 'hidden',
        },
        style,
      ]}>
      <View
        style={{
          width: `${ratio * 100}%`,
          height: '100%',
          borderRadius: theme.radii.pill,
          backgroundColor: color ?? theme.colors.primary,
        }}
      />
    </View>
  );
}

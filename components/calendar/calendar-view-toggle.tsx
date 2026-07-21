/**
 * CalendarViewToggle — a compact segmented control to switch between the Day and
 * Week mobile views. The selected segment is filled and a sliding indicator
 * animates briefly; no layout jump on change.
 */

import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { Text } from '@/components/ui';
import { useTheme } from '@/hooks/use-theme';
import type { CalendarView } from '@/types';
import { hapticSelect } from '@/utils/haptics';

export type CalendarViewToggleProps = {
  view: CalendarView;
  onChange: (view: CalendarView) => void;
};

const OPTIONS: { value: CalendarView; label: string }[] = [
  { value: 'day', label: 'Día' },
  { value: 'week', label: 'Semana' },
];

export function CalendarViewToggle({ view, onChange }: CalendarViewToggleProps) {
  const theme = useTheme();
  const [width, setWidth] = useState(0);
  const index = view === 'week' ? 1 : 0;
  // Subtract the container padding (3 each side) so the indicator aligns.
  const seg = Math.max((width - 6) / 2, 0);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(index * seg, { duration: 180 }) }],
  }));

  return (
    <View
      accessibilityRole="tablist"
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={[styles.container, { backgroundColor: theme.colors.surfaceAlt, borderRadius: theme.radii.pill }]}>
      {width > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.indicator,
            indicatorStyle,
            { width: seg, backgroundColor: theme.colors.surface, borderRadius: theme.radii.pill, ...theme.shadows.sm },
          ]}
        />
      ) : null}
      {OPTIONS.map((option) => {
        const selected = option.value === view;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={`Vista ${option.label}`}
            onPress={() => {
              if (!selected) {
                hapticSelect();
                onChange(option.value);
              }
            }}
            style={styles.segment}>
            <Text variant="label" color={selected ? 'text' : 'textMuted'}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', height: 40, padding: 3, position: 'relative' },
  indicator: { position: 'absolute', top: 3, bottom: 3, left: 3 },
  segment: { flex: 1, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
});

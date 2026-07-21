/**
 * TimeGrid — the timeline background: hour/half-hour lines, hour labels in the
 * left gutter, and a pressable empty slot for every 30 minutes (tapping one
 * starts a new activity at that time). Blocks render on top of this layer.
 */

import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import {
  CALENDAR_DAY_END_MIN,
  CALENDAR_DAY_START_MIN,
  CALENDAR_SLOT_MIN,
} from '@/constants/calendar';
import { useTheme } from '@/hooks/use-theme';
import { minutesToTime, timelineHours } from '@/utils/calendar';
import { GUTTER_WIDTH, minuteToY, SLOT_HEIGHT, TIMELINE_HEIGHT } from './layout';

export type TimeGridProps = {
  onSlotPress: (startMinutes: number) => void;
};

export function TimeGrid({ onSlotPress }: TimeGridProps) {
  const theme = useTheme();

  const hours = timelineHours();

  const slots: number[] = [];
  for (let m = CALENDAR_DAY_START_MIN; m < CALENDAR_DAY_END_MIN; m += CALENDAR_SLOT_MIN) slots.push(m);

  return (
    <View style={[styles.container, { height: TIMELINE_HEIGHT }]} pointerEvents="box-none">
      {/* Pressable empty slots (behind blocks) */}
      {slots.map((m) => (
        <Pressable
          key={`slot-${m}`}
          accessibilityRole="button"
          accessibilityLabel={`Añadir a las ${minutesToTime(m)}`}
          onPress={() => onSlotPress(m)}
          style={[
            styles.slot,
            { top: minuteToY(m), height: SLOT_HEIGHT, left: GUTTER_WIDTH },
          ]}
        />
      ))}

      {/* Half-hour lines (lighter) */}
      {slots.map((m) =>
        (m - CALENDAR_DAY_START_MIN) % 60 === 30 ? (
          <View
            key={`half-${m}`}
            pointerEvents="none"
            style={[
              styles.line,
              { top: minuteToY(m), left: GUTTER_WIDTH, borderTopColor: theme.colors.border, opacity: 0.5 },
            ]}
          />
        ) : null,
      )}

      {/* Hour lines + labels (stronger) */}
      {hours.map((m) => (
        <View key={`hour-${m}`} pointerEvents="none" style={[styles.hourRow, { top: minuteToY(m) }]}>
          <Text variant="caption" color="textSubtle" style={styles.hourLabel}>
            {minutesToTime(m)}
          </Text>
          <View style={[styles.line, styles.hourLine, { left: GUTTER_WIDTH, borderTopColor: theme.colors.border }]} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'relative' },
  slot: { position: 'absolute', right: 0 },
  line: { position: 'absolute', right: 0, borderTopWidth: StyleSheet.hairlineWidth },
  hourRow: { position: 'absolute', left: 0, right: 0, height: 1, flexDirection: 'row', alignItems: 'center' },
  hourLabel: { width: GUTTER_WIDTH, textAlign: 'right', paddingRight: 8, marginTop: -6 },
  hourLine: { borderTopWidth: StyleSheet.hairlineWidth },
});

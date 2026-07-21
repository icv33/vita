/**
 * WeekDaySelector — a responsive weekday picker (Lun…Dom). All seven days fit
 * on a standard iPhone without horizontal scroll (flex row, equal columns).
 * The selected day is the dominant state (solid fill); today (when not selected)
 * gets a subtle ring, so the two never look contradictory.
 */

import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { useTheme } from '@/hooks/use-theme';
import { WEEKDAYS, type Weekday } from '@/types';
import { weekdayShort } from '@/utils/date';

export type WeekDayItem = {
  day: Weekday;
  dayNumber: number;
  count: number;
  isToday: boolean;
};

export type WeekDaySelectorProps = {
  items: WeekDayItem[];
  selectedDay: Weekday;
  onSelect: (day: Weekday) => void;
};

export function WeekDaySelector({ items, selectedDay, onSelect }: WeekDaySelectorProps) {
  const theme = useTheme();
  const byDay = new Map(items.map((i) => [i.day, i]));

  return (
    <View style={styles.row}>
      {WEEKDAYS.map((day) => {
        const item = byDay.get(day) ?? { day, dayNumber: 0, count: 0, isToday: false };
        const selected = day === selectedDay;
        const ring = item.isToday && !selected;
        return (
          <Pressable
            key={day}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={`${weekdayShort(day)} ${item.dayNumber}${item.isToday ? ', hoy' : ''}${
              item.count ? `, ${item.count} actividades` : ''
            }`}
            onPress={() => onSelect(day)}
            style={styles.cell}>
            <View
              style={[
                styles.pill,
                {
                  borderRadius: theme.radii.lg,
                  backgroundColor: selected ? theme.colors.primary : theme.colors.surface,
                  borderColor: ring ? theme.colors.primary : theme.colors.border,
                  borderWidth: ring ? 1.5 : 1,
                },
              ]}>
              <Text variant="caption" color={selected ? 'onPrimary' : 'textMuted'}>
                {weekdayShort(day)}
              </Text>
              <Text
                variant="bodyStrong"
                color={selected ? 'onPrimary' : ring ? 'primary' : 'text'}>
                {item.dayNumber}
              </Text>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      item.count > 0
                        ? selected
                          ? theme.colors.onPrimary
                          : theme.colors.primary
                        : 'transparent',
                  },
                ]}
              />
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6 },
  cell: { flex: 1 },
  pill: {
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 2,
    gap: 2,
  },
  dot: { width: 5, height: 5, borderRadius: 3, marginTop: 1 },
});

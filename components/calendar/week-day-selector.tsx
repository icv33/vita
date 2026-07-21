/**
 * WeekDaySelector — horizontal day picker (Lun…Dom) with the day number, an
 * activity indicator, today highlighted and the selected day clearly filled.
 */

import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

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
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}>
      {WEEKDAYS.map((day) => {
        const item = byDay.get(day) ?? { day, dayNumber: 0, count: 0, isToday: false };
        const selected = day === selectedDay;
        return (
          <Pressable
            key={day}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={`${weekdayShort(day)} ${item.dayNumber}${item.count ? `, ${item.count} actividades` : ''}`}
            onPress={() => onSelect(day)}
            style={[
              styles.pill,
              {
                borderRadius: theme.radii.lg,
                backgroundColor: selected ? theme.colors.primary : theme.colors.surface,
                borderColor: item.isToday && !selected ? theme.colors.primary : theme.colors.border,
                borderWidth: item.isToday && !selected ? 1.5 : 1,
              },
            ]}>
            <Text variant="caption" color={selected ? 'onPrimary' : 'textMuted'}>
              {weekdayShort(day)}
            </Text>
            <Text variant="bodyStrong" color={selected ? 'onPrimary' : 'text'}>
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
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 8, paddingHorizontal: 2, paddingVertical: 2 },
  pill: {
    width: 52,
    minHeight: 64,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 3,
  },
  dot: { width: 5, height: 5, borderRadius: 3, marginTop: 1 },
});

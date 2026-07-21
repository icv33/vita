/**
 * DailySummaryBar — a compact horizontal bar summarising the selected day:
 * busy time, free time, next activity and block count. Sits above the bottom
 * navigation without eating the timeline's height.
 */

import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { useTheme } from '@/hooks/use-theme';
import { formatDuration } from '@/utils/calendar';

export type DailySummaryBarProps = {
  busyMinutes: number;
  freeMinutes: number;
  nextTime: string | null;
  count: number;
};

export function DailySummaryBar({ busyMinutes, freeMinutes, nextTime, count }: DailySummaryBarProps) {
  const theme = useTheme();

  const items: { label: string; value: string; color?: 'success' | 'text' }[] = [
    { label: 'Ocupado', value: formatDuration(busyMinutes) },
    { label: 'Libre', value: formatDuration(freeMinutes), color: 'success' },
    { label: 'Próxima', value: nextTime ?? '—' },
    { label: 'Bloques', value: String(count) },
  ];

  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}>
      {items.map((item, i) => (
        <View key={item.label} style={styles.item}>
          {i > 0 ? <View style={[styles.divider, { backgroundColor: theme.colors.border }]} /> : null}
          <View style={styles.itemInner}>
            <Text variant="caption" color="textMuted" numberOfLines={1}>
              {item.label}
            </Text>
            <Text variant="bodyStrong" color={item.color ?? 'text'} numberOfLines={1}>
              {item.value}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: 8,
  },
  item: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  itemInner: { flex: 1, alignItems: 'center', gap: 1 },
  divider: { width: StyleSheet.hairlineWidth, height: 26 },
});

/**
 * WeeklySummaryCard — a compact week overview (total busy/free, block count and
 * most-available day) with a link to the full weekly summary. Reuses the pure
 * `weekTotals` — no duplicated maths.
 */

import { Pressable, StyleSheet, View } from 'react-native';

import { Card, Icon, Text } from '@/components/ui';
import { useTheme } from '@/hooks/use-theme';
import type { WeekSchedule } from '@/types';
import { formatDuration, weekTotals } from '@/utils/calendar';
import { weekdayLabel } from '@/utils/date';

export type WeeklySummaryCardProps = {
  schedule: WeekSchedule | null;
  onOpenSummary: () => void;
};

export function WeeklySummaryCard({ schedule, onOpenSummary }: WeeklySummaryCardProps) {
  const theme = useTheme();
  const totals = weekTotals(schedule);

  const stats = [
    { label: 'Ocupado', value: formatDuration(totals.totalBusyMinutes) },
    { label: 'Libre', value: formatDuration(totals.totalFreeMinutes) },
    { label: 'Bloques', value: String(totals.totalBlocks) },
  ];

  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <Text variant="label" color="textMuted">
          RESUMEN DE LA SEMANA
        </Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Ver resumen completo" hitSlop={8} onPress={onOpenSummary} style={styles.link}>
          <Text variant="label" color="primary">
            Ver más
          </Text>
          <Icon name="chevronRight" size={theme.sizes.iconSm} color={theme.colors.primary} />
        </Pressable>
      </View>

      <View style={styles.stats}>
        {stats.map((s) => (
          <View key={s.label} style={styles.stat}>
            <Text variant="heading">{s.value}</Text>
            <Text variant="caption" color="textMuted">
              {s.label}
            </Text>
          </View>
        ))}
      </View>

      {totals.mostAvailableDay ? (
        <Text variant="caption" color="textSubtle">
          Día con más disponibilidad · {weekdayLabel(totals.mostAvailableDay)}
        </Text>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  link: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  stats: { flexDirection: 'row', justifyContent: 'space-between' },
  stat: { alignItems: 'center', gap: 2, flex: 1 },
});

/**
 * WeeklySummary — a read-only overview of the week: busy/free hours per day,
 * category distribution, most-available days and the longest free window per
 * day. Simple cards + bars (no charting dependency).
 */

import { StyleSheet, View } from 'react-native';

import { Card, Text } from '@/components/ui';
import { ACTIVITY_CATEGORIES, CALENDAR_WINDOW_MIN, categoryMeta } from '@/constants/calendar';
import { useTheme } from '@/hooks/use-theme';
import type { WeekSchedule } from '@/types';
import { WEEKDAYS } from '@/types';
import {
  blocksForDay,
  busyMinutes,
  categoryDistribution,
  daysByAvailability,
  formatDuration,
  freeMinutes,
  longestFreeWindow,
} from '@/utils/calendar';
import { weekdayLabel } from '@/utils/date';

export type WeeklySummaryProps = {
  schedule: WeekSchedule | null;
};

export function WeeklySummary({ schedule }: WeeklySummaryProps) {
  const theme = useTheme();
  const ranked = daysByAvailability(schedule);
  const dist = categoryDistribution(schedule);
  const distEntries = ACTIVITY_CATEGORIES.filter((c) => (dist[c.value] ?? 0) > 0).map((c) => ({
    ...c,
    minutes: dist[c.value] ?? 0,
  }));

  return (
    <View style={styles.container}>
      {/* Most available days */}
      <Card style={styles.card}>
        <Text variant="label" color="textMuted">
          DÍAS CON MÁS DISPONIBILIDAD
        </Text>
        <View style={styles.chips}>
          {ranked.slice(0, 3).map((r) => (
            <View key={r.day} style={[styles.chip, { backgroundColor: theme.colors.primaryMuted, borderRadius: theme.radii.pill }]}>
              <Text variant="label" color="primary">
                {weekdayLabel(r.day)}
              </Text>
              <Text variant="caption" color="textMuted">
                {formatDuration(r.freeMinutes)} libres
              </Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Per-day busy/free bars */}
      <Card style={styles.card}>
        <Text variant="label" color="textMuted">
          POR DÍA
        </Text>
        {WEEKDAYS.map((day) => {
          const dayBlocks = blocksForDay(schedule, day);
          const busy = busyMinutes(dayBlocks);
          const free = freeMinutes(dayBlocks);
          const longest = longestFreeWindow(dayBlocks);
          const busyRatio = CALENDAR_WINDOW_MIN ? busy / CALENDAR_WINDOW_MIN : 0;
          return (
            <View key={day} style={styles.dayRow}>
              <View style={styles.dayHeader}>
                <Text variant="callout">{weekdayLabel(day)}</Text>
                <Text variant="caption" color="textMuted">
                  {formatDuration(free)} libres · {formatDuration(busy)} ocupadas
                </Text>
              </View>
              <View style={[styles.track, { backgroundColor: theme.colors.surfaceAlt, borderRadius: theme.radii.pill }]}>
                <View
                  style={{
                    width: `${Math.round(busyRatio * 100)}%`,
                    height: '100%',
                    backgroundColor: theme.colors.primary,
                    borderRadius: theme.radii.pill,
                  }}
                />
              </View>
              {longest ? (
                <Text variant="caption" color="textSubtle">
                  Hueco más largo: {formatDuration(longest.endMinutes - longest.startMinutes)}
                </Text>
              ) : (
                <Text variant="caption" color="textSubtle">
                  Sin huecos libres
                </Text>
              )}
            </View>
          );
        })}
      </Card>

      {/* Category distribution */}
      {distEntries.length > 0 ? (
        <Card style={styles.card}>
          <Text variant="label" color="textMuted">
            DISTRIBUCIÓN POR CATEGORÍA
          </Text>
          {distEntries.map((c) => (
            <View key={c.value} style={styles.distRow}>
              <View style={[styles.dot, { backgroundColor: categoryMeta(c.value).color }]} />
              <Text variant="body" style={styles.flex}>
                {c.label}
              </Text>
              <Text variant="callout" color="textMuted">
                {formatDuration(c.minutes)}
              </Text>
            </View>
          ))}
        </Card>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  card: { gap: 12 },
  flex: { flex: 1 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, gap: 2 },
  dayRow: { gap: 6 },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 },
  track: { height: 8, overflow: 'hidden' },
  distRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 10, height: 10, borderRadius: 5 },
});

/**
 * WeekDayAgendaCard — one card per day in the mobile week view. Shows the day
 * header (name + number + today), the ordered activities as compact rows (or a
 * short "day free" line), and a small add action. Tapping the header opens that
 * day in the Day view. No busy/free/duration statistics are shown here — that
 * math still runs internally (via `daySummary`) for the future planner, it just
 * isn't rendered on this card.
 */

import { Pressable, StyleSheet, View } from 'react-native';

import { Card, Icon, Text } from '@/components/ui';
import { useTheme } from '@/hooks/use-theme';
import type { ActivityBlock, Weekday } from '@/types';
import type { DaySummary } from '@/utils/calendar';
import { weekdayLabel } from '@/utils/date';
import { CompactActivityBlock } from './compact-activity-block';

export type WeekDayAgendaCardProps = {
  day: Weekday;
  dayNumber: number;
  isToday: boolean;
  summary: DaySummary;
  onOpenDay: (day: Weekday) => void;
  onAddDay: (day: Weekday) => void;
  onBlockPress: (block: ActivityBlock) => void;
};

export function WeekDayAgendaCard({
  day,
  dayNumber,
  isToday,
  summary,
  onOpenDay,
  onAddDay,
  onBlockPress,
}: WeekDayAgendaCardProps) {
  const theme = useTheme();
  const { blocks } = summary;

  return (
    <Card style={styles.card}>
      {/* Header (opens the day) */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Abrir ${weekdayLabel(day)} ${dayNumber}`}
        onPress={() => onOpenDay(day)}
        style={styles.header}>
        <View style={styles.headerLeft}>
          <Text variant="bodyStrong">{weekdayLabel(day)}</Text>
          <Text variant="bodyStrong" color="textMuted">
            {dayNumber}
          </Text>
          {isToday ? (
            <View style={[styles.todayBadge, { backgroundColor: theme.colors.primaryMuted, borderRadius: theme.radii.pill }]}>
              <Text variant="caption" color="primary">
                Hoy
              </Text>
            </View>
          ) : null}
        </View>
        <Icon name="chevronRight" size={theme.sizes.iconSm} color={theme.colors.textSubtle} />
      </Pressable>

      {/* Activities */}
      {blocks.length > 0 ? (
        <View style={styles.blocks}>
          {blocks.map((block) => (
            <CompactActivityBlock key={block.id} block={block} onPress={onBlockPress} />
          ))}
        </View>
      ) : (
        <Text variant="caption" color="textSubtle" style={styles.freeAll}>
          Día libre
        </Text>
      )}

      {/* Footer: add another activity */}
      <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Añadir actividad el ${weekdayLabel(day)}`}
          hitSlop={8}
          onPress={() => onAddDay(day)}
          style={styles.addRow}>
          <Icon name="add" size={theme.sizes.iconSm} color={theme.colors.primary} />
          <Text variant="label" color="primary">
            Añadir actividad
          </Text>
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: 10 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  todayBadge: { paddingHorizontal: 8, paddingVertical: 2 },
  blocks: { gap: 2 },
  freeAll: { paddingVertical: 4 },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
  },
  addRow: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 32, alignSelf: 'flex-start' },
});

/**
 * WeekDayAgendaCard — one card per day in the mobile week view. Shows the day
 * header (name + number + today), busy/free summary, the ordered activities as
 * compact rows, the longest free window and a small add button. Tapping the
 * header opens that day in the Day view.
 */

import { Pressable, StyleSheet, View } from 'react-native';

import { Card, Icon, Text } from '@/components/ui';
import { useTheme } from '@/hooks/use-theme';
import type { ActivityBlock, Weekday } from '@/types';
import type { DaySummary } from '@/utils/calendar';
import { formatDuration, formatRange } from '@/utils/calendar';
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
  const { blocks, busyMinutes: busy, freeMinutes: free, longestFree } = summary;

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
        <Text variant="caption" color={busy > 0 ? 'textMuted' : 'success'}>
          {busy > 0 ? `${formatDuration(busy)} ocupadas` : 'Libre todo el día'}
        </Text>
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
          Sin actividades · {formatDuration(free)} libres
        </Text>
      )}

      {/* Footer: longest free window + add */}
      <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
        <View style={styles.footerInfo}>
          {longestFree ? (
            <Text variant="caption" color="textSubtle" numberOfLines={1}>
              Mayor hueco libre · {formatRange(longestFree.startMinutes, longestFree.endMinutes)}
            </Text>
          ) : (
            <Text variant="caption" color="textSubtle">
              Sin huecos libres
            </Text>
          )}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Añadir actividad el ${weekdayLabel(day)}`}
          hitSlop={8}
          onPress={() => onAddDay(day)}
          style={[styles.addBtn, { borderColor: theme.colors.border, borderRadius: theme.radii.pill }]}>
          <Icon name="add" size={theme.sizes.iconSm} color={theme.colors.primary} />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 10,
  },
  footerInfo: { flex: 1 },
  addBtn: { width: 32, height: 32, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
});

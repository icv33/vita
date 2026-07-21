/**
 * MobileWeekView — the week as a vertical list of per-day agenda cards (never a
 * cramped 7-column desktop grid). When the whole week is empty it still shows
 * the seven days (all available) plus a short prompt. No busy/free/duration
 * totals are shown here; the dedicated "Ver resumen semanal" screen (reachable
 * from the calendar's action menu) still exists for anyone who wants that detail.
 */

import { ScrollView, StyleSheet } from 'react-native';

import { Card, Icon, Text } from '@/components/ui';
import { useTheme } from '@/hooks/use-theme';
import type { ActivityBlock, WeekSchedule, Weekday } from '@/types';
import { WEEKDAYS } from '@/types';
import { daySummary } from '@/utils/calendar';
import { WeekDayAgendaCard } from './week-day-agenda-card';

export type WeekDayInfo = { day: Weekday; dayNumber: number; isToday: boolean };

export type MobileWeekViewProps = {
  schedule: WeekSchedule | null;
  days: WeekDayInfo[];
  onOpenDay: (day: Weekday) => void;
  onAddDay: (day: Weekday) => void;
  onBlockPress: (block: ActivityBlock) => void;
};

export function MobileWeekView({ schedule, days, onOpenDay, onAddDay, onBlockPress }: MobileWeekViewProps) {
  const theme = useTheme();
  const byDay = new Map(days.map((d) => [d.day, d]));
  const isEmpty = (schedule?.blocks.length ?? 0) === 0;

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[styles.content, { paddingHorizontal: theme.spacing.lg }]}
      showsVerticalScrollIndicator={false}>
      {isEmpty ? (
        <Card elevation="none" style={[styles.prompt, { backgroundColor: theme.colors.surfaceAlt }]}>
          <Icon name="sparkles" size={theme.sizes.iconSm} color={theme.colors.primary} />
          <Text variant="caption" color="textMuted" style={styles.promptText}>
            Añade tus horarios ocupados para que Vita pueda utilizar el tiempo restante.
          </Text>
        </Card>
      ) : null}

      {WEEKDAYS.map((day) => {
        const info = byDay.get(day) ?? { day, dayNumber: 0, isToday: false };
        return (
          <WeekDayAgendaCard
            key={day}
            day={day}
            dayNumber={info.dayNumber}
            isToday={info.isToday}
            summary={daySummary(schedule, day)}
            onOpenDay={onOpenDay}
            onAddDay={onAddDay}
            onBlockPress={onBlockPress}
          />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { gap: 12, paddingTop: 4, paddingBottom: 24 },
  prompt: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 12 },
  promptText: { flex: 1 },
});

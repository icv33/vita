/**
 * CalendarHeader — the calendar's top chrome, laid out for mobile in clear rows
 * instead of one crowded line: title + actions, then a week pager with a Today
 * button, then the Day/Week toggle.
 */

import { Pressable, StyleSheet, View } from 'react-native';

import { Icon, Text } from '@/components/ui';
import { useTheme } from '@/hooks/use-theme';
import type { CalendarView } from '@/types';
import { CalendarViewToggle } from './calendar-view-toggle';

export type CalendarHeaderProps = {
  weekLabel: string;
  view: CalendarView;
  onChangeView: (view: CalendarView) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
  onActions: () => void;
  /** True when already on the current week (Today has nothing to do). */
  isCurrentWeek: boolean;
};

export function CalendarHeader({
  weekLabel,
  view,
  onChangeView,
  onPrevWeek,
  onNextWeek,
  onToday,
  onActions,
  isCurrentWeek,
}: CalendarHeaderProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { paddingHorizontal: theme.spacing.lg }]}>
      {/* Row 1: title + actions */}
      <View style={styles.titleRow}>
        <Text variant="title">Calendario</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Acciones del calendario"
          hitSlop={10}
          onPress={onActions}
          style={styles.iconBtn}>
          <Icon name="ellipsis" size={theme.sizes.iconLg} color={theme.colors.text} />
        </Pressable>
      </View>

      {/* Row 2: week pager + Today */}
      <View style={styles.pagerRow}>
        <View style={styles.pager}>
          <Pressable accessibilityRole="button" accessibilityLabel="Semana anterior" hitSlop={10} onPress={onPrevWeek} style={styles.pagerBtn}>
            <Icon name="chevronLeft" size={theme.sizes.iconMd} color={theme.colors.textMuted} />
          </Pressable>
          <Text variant="callout" color="text" style={styles.weekLabel}>
            {weekLabel}
          </Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Semana siguiente" hitSlop={10} onPress={onNextWeek} style={styles.pagerBtn}>
            <Icon name="chevronRight" size={theme.sizes.iconMd} color={theme.colors.textMuted} />
          </Pressable>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ir a hoy"
          accessibilityState={{ disabled: isCurrentWeek }}
          onPress={onToday}
          disabled={isCurrentWeek}
          style={[
            styles.today,
            {
              borderColor: theme.colors.border,
              borderRadius: theme.radii.pill,
              opacity: isCurrentWeek ? 0.45 : 1,
            },
          ]}>
          <Icon name="today" size={theme.sizes.iconSm} color={theme.colors.primary} />
          <Text variant="label" color="primary">
            Hoy
          </Text>
        </Pressable>
      </View>

      {/* Row 3: Day / Week toggle */}
      <CalendarViewToggle view={view} onChange={onChangeView} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10, paddingTop: 4, paddingBottom: 8 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconBtn: { width: 40, height: 40, alignItems: 'flex-end', justifyContent: 'center' },
  pagerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  pager: { flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 },
  pagerBtn: { padding: 4 },
  weekLabel: { minWidth: 0 },
  today: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 36,
  },
});

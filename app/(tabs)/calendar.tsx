import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import {
  CalendarActions,
  DayPickerSheet,
  DayTimeline,
  EmptyScheduleState,
  WeekDaySelector,
  type WeekDayItem,
} from '@/components/calendar';
import { Icon, SafeArea, Text } from '@/components/ui';
import { useTheme } from '@/hooks/use-theme';
import { useCalendarStore } from '@/store';
import { WEEKDAYS, type ActivityBlock, type Weekday } from '@/types';
import {
  blocksForDay,
  busyMinutes,
  formatDuration,
  freeGaps,
  freeMinutes,
  minutesToTime,
  nextBlock,
} from '@/utils/calendar';
import { CALENDAR_DAY_START_MIN } from '@/constants/calendar';
import { addDays, startOfWeekMonday, todayWeekday, weekRangeLabel } from '@/utils/date';
import { hapticSelect } from '@/utils/haptics';

const WEEKDAYS_MON_FRI: Weekday[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

export default function CalendarScreen() {
  const theme = useTheme();
  const router = useRouter();
  const schedule = useCalendarStore((s) => s.schedule);
  const selectedDay = useCalendarStore((s) => s.selectedDay);
  const setSelectedDay = useCalendarStore((s) => s.setSelectedDay);
  const copyDayToDays = useCalendarStore((s) => s.copyDayToDays);
  const clearDay = useCalendarStore((s) => s.clearDay);
  const resetWeek = useCalendarStore((s) => s.resetWeek);

  const [weekOffset, setWeekOffset] = useState(0);
  const [actionsVisible, setActionsVisible] = useState(false);
  const [copyPickerVisible, setCopyPickerVisible] = useState(false);

  const today = todayWeekday();
  const displayedMonday = addDays(startOfWeekMonday(new Date()), weekOffset * 7);

  const weekItems: WeekDayItem[] = WEEKDAYS.map((day, i) => ({
    day,
    dayNumber: addDays(displayedMonday, i).getDate(),
    count: schedule ? schedule.blocks.filter((b) => b.dayOfWeek === day).length : 0,
    isToday: weekOffset === 0 && day === today,
  }));

  const dayBlocks = blocksForDay(schedule, selectedDay);
  const isTodaySelected = weekOffset === 0 && selectedDay === today;
  const totalBlocks = schedule?.blocks.length ?? 0;

  const busy = busyMinutes(dayBlocks);
  const free = freeMinutes(dayBlocks);
  const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
  const upcoming: ActivityBlock | null = nextBlock(dayBlocks, isTodaySelected ? nowMinutes : CALENDAR_DAY_START_MIN);

  const openCreate = (startMinutes: number) => {
    router.push({ pathname: '/calendar-editor', params: { day: selectedDay, start: String(startMinutes) } });
  };

  const openBlock = (block: ActivityBlock) => {
    router.push({ pathname: '/calendar-editor', params: { blockId: block.id } });
  };

  const addAtFirstFreeSlot = () => {
    const firstGap = freeGaps(dayBlocks)[0];
    openCreate(firstGap ? firstGap.startMinutes : CALENDAR_DAY_START_MIN + 120);
  };

  const applyWeekdays = async () => {
    const report = await copyDayToDays(selectedDay, WEEKDAYS_MON_FRI);
    Alert.alert(
      'Aplicado a lunes–viernes',
      report.copied > 0
        ? `${report.copied} copiadas${report.skipped ? `, ${report.skipped} omitidas por conflicto` : ''}.`
        : 'No se copió nada (conflictos o nada que copiar).',
    );
  };

  const confirmClearDay = () => {
    Alert.alert('Vaciar día', '¿Eliminar todas las actividades de este día?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Vaciar', style: 'destructive', onPress: () => void clearDay(selectedDay) },
    ]);
  };

  const confirmResetWeek = () => {
    Alert.alert('Restablecer la semana', '¿Eliminar todas las actividades de la semana?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Restablecer', style: 'destructive', onPress: () => void resetWeek() },
    ]);
  };

  const copyDayConfirm = async (days: Weekday[]) => {
    setCopyPickerVisible(false);
    const report = await copyDayToDays(selectedDay, days);
    Alert.alert(
      'Copiado',
      report.copied > 0
        ? `${report.copied} copiadas${report.skipped ? `, ${report.skipped} omitidas por conflicto` : ''}.`
        : 'No se copió nada por conflictos.',
    );
  };

  return (
    <SafeArea edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: theme.spacing.lg }]}>
        <Text variant="title">Calendario</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Acciones"
          hitSlop={10}
          onPress={() => setActionsVisible(true)}
          style={styles.iconBtn}>
          <Icon name="ellipsis" size={theme.sizes.iconLg} color={theme.colors.text} />
        </Pressable>
      </View>

      {/* Week pager */}
      <View style={[styles.weekPager, { paddingHorizontal: theme.spacing.lg }]}>
        <Pressable accessibilityRole="button" accessibilityLabel="Semana anterior" hitSlop={10} onPress={() => setWeekOffset((o) => o - 1)}>
          <Icon name="chevronLeft" size={theme.sizes.iconMd} color={theme.colors.textMuted} />
        </Pressable>
        <Text variant="callout" color="textMuted">
          {weekRangeLabel(displayedMonday)}
        </Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Semana siguiente" hitSlop={10} onPress={() => setWeekOffset((o) => o + 1)}>
          <Icon name="chevronRight" size={theme.sizes.iconMd} color={theme.colors.textMuted} />
        </Pressable>
      </View>

      {/* Day selector */}
      <View style={[styles.selector, { paddingHorizontal: theme.spacing.lg }]}>
        <WeekDaySelector
          items={weekItems}
          selectedDay={selectedDay}
          onSelect={(d) => {
            hapticSelect();
            setSelectedDay(d);
          }}
        />
      </View>

      {/* Timeline or empty state */}
      {totalBlocks === 0 ? (
        <View style={styles.flex}>
          <EmptyScheduleState onAdd={addAtFirstFreeSlot} />
        </View>
      ) : (
        <DayTimeline blocks={dayBlocks} isToday={isTodaySelected} onSlotPress={openCreate} onBlockPress={openBlock} />
      )}

      {/* Bottom summary */}
      <View style={[styles.summary, { borderTopColor: theme.colors.border, backgroundColor: theme.colors.surface, paddingHorizontal: theme.spacing.lg }]}>
        <View style={styles.summaryItem}>
          <Text variant="caption" color="textMuted">
            Ocupadas
          </Text>
          <Text variant="bodyStrong">{formatDuration(busy)}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text variant="caption" color="textMuted">
            Disponibles
          </Text>
          <Text variant="bodyStrong" color="success">
            {formatDuration(free)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text variant="caption" color="textMuted">
            Próxima
          </Text>
          <Text variant="bodyStrong">{upcoming ? minutesToTime(upcoming.startMinutes) : '—'}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text variant="caption" color="textMuted">
            Bloques
          </Text>
          <Text variant="bodyStrong">{dayBlocks.length}</Text>
        </View>
      </View>

      {/* FAB */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Añadir actividad"
        onPress={addAtFirstFreeSlot}
        style={({ pressed }) => [
          styles.fab,
          { backgroundColor: theme.colors.primary, opacity: pressed ? 0.9 : 1, ...theme.shadows.lg },
        ]}>
        <Icon name="add" size={28} color={theme.colors.onPrimary} />
      </Pressable>

      <CalendarActions
        visible={actionsVisible}
        day={selectedDay}
        onClose={() => setActionsVisible(false)}
        onCopyDay={() => setCopyPickerVisible(true)}
        onApplyWeekdays={applyWeekdays}
        onClearDay={confirmClearDay}
        onResetWeek={confirmResetWeek}
        onViewSummary={() => router.push('/calendar-summary')}
      />
      <DayPickerSheet
        visible={copyPickerVisible}
        title="Copiar este día a…"
        excludeDay={selectedDay}
        mode="multi"
        onClose={() => setCopyPickerVisible(false)}
        onConfirm={copyDayConfirm}
      />
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    paddingBottom: 6,
  },
  iconBtn: { width: 40, height: 40, alignItems: 'flex-end', justifyContent: 'center' },
  weekPager: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  selector: { paddingBottom: 8 },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: 10,
  },
  summaryItem: { alignItems: 'center', gap: 2, flex: 1 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 84,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

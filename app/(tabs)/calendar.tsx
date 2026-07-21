import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import {
  CalendarActions,
  CalendarHeader,
  CalendarSettingsSheet,
  DayEmptyHint,
  DayPickerSheet,
  DayTimeline,
  MobileWeekView,
  WeekDaySelector,
  type WeekDayInfo,
  type WeekDayItem,
} from '@/components/calendar';
import { Icon, SafeArea } from '@/components/ui';
import { useTheme } from '@/hooks/use-theme';
import { useCalendarStore } from '@/store';
import { WEEKDAYS, type ActivityBlock, type Weekday } from '@/types';
import { blocksForDay, shouldShowEmptyDayHint, suggestedNewBlockStart } from '@/utils/calendar';
import { addDays, startOfWeekMonday, todayWeekday, weekRangeLabel } from '@/utils/date';
import { hapticImpact, hapticSelect } from '@/utils/haptics';

const WEEKDAYS_MON_FRI: Weekday[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

export default function CalendarScreen() {
  const theme = useTheme();
  const router = useRouter();

  const schedule = useCalendarStore((s) => s.schedule);
  const selectedDay = useCalendarStore((s) => s.selectedDay);
  const weekOffset = useCalendarStore((s) => s.weekOffset);
  const view = useCalendarStore((s) => s.view);
  const setSelectedDay = useCalendarStore((s) => s.setSelectedDay);
  const setWeekOffset = useCalendarStore((s) => s.setWeekOffset);
  const setView = useCalendarStore((s) => s.setView);
  const goToToday = useCalendarStore((s) => s.goToToday);
  const copyDayToDays = useCalendarStore((s) => s.copyDayToDays);
  const clearDay = useCalendarStore((s) => s.clearDay);
  const resetWeek = useCalendarStore((s) => s.resetWeek);
  const resetCalendar = useCalendarStore((s) => s.resetCalendar);

  const [actionsVisible, setActionsVisible] = useState(false);
  const [copyPickerVisible, setCopyPickerVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(false);

  // Re-show the empty-day hint when the selected day changes.
  useEffect(() => setHintDismissed(false), [selectedDay]);

  const today = todayWeekday();
  const displayedMonday = addDays(startOfWeekMonday(new Date()), weekOffset * 7);
  const isCurrentWeek = weekOffset === 0;

  const weekItems: WeekDayItem[] = WEEKDAYS.map((day, i) => ({
    day,
    dayNumber: addDays(displayedMonday, i).getDate(),
    count: schedule ? schedule.blocks.filter((b) => b.dayOfWeek === day).length : 0,
    isToday: isCurrentWeek && day === today,
  }));
  const weekDayInfo: WeekDayInfo[] = weekItems.map(({ day, dayNumber, isToday }) => ({ day, dayNumber, isToday }));

  const dayBlocks = blocksForDay(schedule, selectedDay);
  const isTodaySelected = isCurrentWeek && selectedDay === today;
  const showHint = view === 'day' && shouldShowEmptyDayHint(dayBlocks.length, hintDismissed);

  // ── Navigation to editor ────────────────────────────────────────────────
  const openCreate = (day: Weekday, startMinutes: number) => {
    router.push({ pathname: '/calendar-editor', params: { day, start: String(startMinutes) } });
  };
  const openBlock = (block: ActivityBlock) => {
    router.push({ pathname: '/calendar-editor', params: { blockId: block.id } });
  };
  const addToDay = (day: Weekday) => {
    hapticImpact();
    openCreate(day, suggestedNewBlockStart(blocksForDay(schedule, day)));
  };

  const openDayFromWeek = (day: Weekday) => {
    hapticSelect();
    setSelectedDay(day);
    setView('day');
  };

  // ── Actions ──────────────────────────────────────────────────────────────
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
  const confirmResetCalendar = () => {
    Alert.alert('Reiniciar calendario', 'Se eliminarán el horario y los ajustes del calendario.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Reiniciar', style: 'destructive', onPress: () => void resetCalendar() },
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
      <CalendarHeader
        weekLabel={weekRangeLabel(displayedMonday)}
        view={view}
        onChangeView={setView}
        onPrevWeek={() => setWeekOffset(weekOffset - 1)}
        onNextWeek={() => setWeekOffset(weekOffset + 1)}
        onToday={goToToday}
        onActions={() => setActionsVisible(true)}
        isCurrentWeek={isCurrentWeek}
      />

      {view === 'day' ? (
        <>
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

          <View style={styles.dayBody}>
            <DayTimeline
              blocks={dayBlocks}
              isToday={isTodaySelected}
              onSlotPress={(start) => openCreate(selectedDay, start)}
              onBlockPress={openBlock}
            />
            {showHint ? (
              <View pointerEvents="box-none" style={[styles.hintOverlay, { paddingHorizontal: theme.spacing.lg }]}>
                <DayEmptyHint onDismiss={() => setHintDismissed(true)} />
              </View>
            ) : null}
          </View>
        </>
      ) : (
        <MobileWeekView
          schedule={schedule}
          days={weekDayInfo}
          onOpenDay={openDayFromWeek}
          onAddDay={addToDay}
          onBlockPress={openBlock}
        />
      )}

      {/* FAB */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Añadir actividad"
        onPress={() => addToDay(selectedDay)}
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
        onAddActivity={() => addToDay(selectedDay)}
        onViewSummary={() => router.push('/calendar-summary')}
        onCopyDay={() => setCopyPickerVisible(true)}
        onApplyWeekdays={applyWeekdays}
        onSettings={() => setSettingsVisible(true)}
        onClearDay={confirmClearDay}
        onResetWeek={confirmResetWeek}
        onResetCalendar={__DEV__ ? confirmResetCalendar : undefined}
      />
      <DayPickerSheet
        visible={copyPickerVisible}
        title="Copiar este día a…"
        excludeDay={selectedDay}
        mode="multi"
        onClose={() => setCopyPickerVisible(false)}
        onConfirm={copyDayConfirm}
      />
      <CalendarSettingsSheet visible={settingsVisible} onClose={() => setSettingsVisible(false)} />
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  selector: { paddingBottom: 8 },
  dayBody: { flex: 1, position: 'relative' },
  hintOverlay: { position: 'absolute', top: 8, left: 0, right: 0 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

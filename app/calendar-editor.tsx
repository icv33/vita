import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { ActivityEditor, DayPickerSheet, type ActivityEditorValues } from '@/components/calendar';
import { CALENDAR_DAY_END_MIN } from '@/constants/calendar';
import { useCalendarStore } from '@/store';
import { WEEKDAYS, type Weekday } from '@/types';
import { blocksForDay } from '@/utils/calendar';
import { hapticImpact } from '@/utils/haptics';
import { weekdayLabel } from '@/utils/date';

function asWeekday(value: string | undefined, fallback: Weekday): Weekday {
  return WEEKDAYS.includes(value as Weekday) ? (value as Weekday) : fallback;
}

/**
 * Activity editor (modal route). Creates a block (from `day` + `start`) or edits
 * an existing one (`blockId`), delegating the form + validation to ActivityEditor
 * and the mutations to the calendar store.
 */
export default function CalendarEditorScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ day?: string; start?: string; blockId?: string }>();

  const schedule = useCalendarStore((s) => s.schedule);
  const selectedDay = useCalendarStore((s) => s.selectedDay);
  const addBlock = useCalendarStore((s) => s.addBlock);
  const updateBlock = useCalendarStore((s) => s.updateBlock);
  const removeBlock = useCalendarStore((s) => s.removeBlock);
  const copyBlockToDay = useCalendarStore((s) => s.copyBlockToDay);

  const [pickerVisible, setPickerVisible] = useState(false);

  const editing = params.blockId ? schedule?.blocks.find((b) => b.id === params.blockId) : undefined;
  const day: Weekday = editing?.dayOfWeek ?? asWeekday(params.day, selectedDay);
  const mode: 'create' | 'edit' = editing ? 'edit' : 'create';

  const startParam = Number(params.start);
  const defaultStart = Number.isFinite(startParam) ? startParam : 9 * 60;
  const defaultEnd = Math.min(defaultStart + 60, CALENDAR_DAY_END_MIN);

  const initial: ActivityEditorValues = editing
    ? {
        startMinutes: editing.startMinutes,
        endMinutes: editing.endMinutes,
        category: editing.category,
        title: editing.title ?? '',
        location: editing.location,
        notes: editing.notes ?? '',
        isRecurringWeekly: editing.isRecurringWeekly,
      }
    : {
        startMinutes: defaultStart,
        endMinutes: defaultEnd,
        category: 'work',
        title: '',
        location: undefined,
        notes: '',
        isRecurringWeekly: true,
      };

  const sameDayBlocks = blocksForDay(schedule, day);

  const handleSave = async (values: ActivityEditorValues) => {
    hapticImpact();
    if (editing) {
      await updateBlock(editing.id, {
        startMinutes: values.startMinutes,
        endMinutes: values.endMinutes,
        category: values.category,
        title: values.title,
        location: values.location,
        notes: values.notes,
        isRecurringWeekly: values.isRecurringWeekly,
      });
    } else {
      await addBlock({
        dayOfWeek: day,
        startMinutes: values.startMinutes,
        endMinutes: values.endMinutes,
        category: values.category,
        title: values.title,
        location: values.location,
        notes: values.notes,
        isRecurringWeekly: values.isRecurringWeekly,
      });
    }
    router.back();
  };

  const handleDelete = () => {
    if (!editing) return;
    Alert.alert('Eliminar actividad', '¿Seguro que quieres eliminar esta actividad?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await removeBlock(editing.id);
          router.back();
        },
      },
    ]);
  };

  const handleCopyToDay = async (days: Weekday[]) => {
    if (!editing) return;
    setPickerVisible(false);
    const target = days[0];
    const report = await copyBlockToDay(editing.id, target);
    if (report.copied > 0) {
      Alert.alert('Copiada', `Actividad copiada a ${weekdayLabel(target)}.`);
    } else {
      Alert.alert('No se pudo copiar', `Se solapa con otra actividad de ${weekdayLabel(target)}.`);
    }
  };

  return (
    <>
      <ActivityEditor
        mode={mode}
        day={day}
        initial={initial}
        sameDayBlocks={sameDayBlocks}
        editingId={editing?.id}
        readOnly={Boolean(editing?.readOnly)}
        onSave={handleSave}
        onCancel={() => router.back()}
        onDelete={editing && !editing.readOnly ? handleDelete : undefined}
        onDuplicate={editing && !editing.readOnly ? () => setPickerVisible(true) : undefined}
      />
      <DayPickerSheet
        visible={pickerVisible}
        title="Copiar a…"
        excludeDay={day}
        mode="single"
        onClose={() => setPickerVisible(false)}
        onConfirm={handleCopyToDay}
      />
    </>
  );
}

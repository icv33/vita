/**
 * ActivityEditor — presentational form to create or edit a block. Holds local
 * form state, validates live (window, min duration, conflicts) and never lets
 * the caller save an invalid block. Edit mode also exposes duplicate/delete.
 */

import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Button, Field, Icon, SafeArea, Text } from '@/components/ui';
import { ChipGroup } from '@/components/onboarding/chip-group';
import { Checkbox } from '@/components/onboarding/checkbox';
import {
  ACTIVITY_CATEGORIES,
  ACTIVITY_LOCATIONS,
  CALENDAR_DAY_END_MIN,
  CALENDAR_DAY_START_MIN,
  CALENDAR_SLOT_MIN,
} from '@/constants/calendar';
import { useTheme } from '@/hooks/use-theme';
import type { ActivityBlock, ActivityCategory, ActivityLocation, Weekday } from '@/types';
import { minutesToTime } from '@/utils/calendar';
import { weekdayLabel } from '@/utils/date';
import { hapticSelect } from '@/utils/haptics';
import { validateBlock } from '@/validation';

export type ActivityEditorValues = {
  startMinutes: number;
  endMinutes: number;
  category: ActivityCategory;
  title: string;
  location?: ActivityLocation;
  notes: string;
  isRecurringWeekly: boolean;
};

export type ActivityEditorProps = {
  mode: 'create' | 'edit';
  day: Weekday;
  initial: ActivityEditorValues;
  /** Same-day blocks used for conflict detection (excluding the edited one). */
  sameDayBlocks: ActivityBlock[];
  editingId?: string;
  onSave: (values: ActivityEditorValues) => void;
  onCancel: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
};

const CATEGORY_OPTIONS = ACTIVITY_CATEGORIES.map((c) => ({ value: c.value, label: c.label, icon: c.icon }));
const LOCATION_OPTIONS = ACTIVITY_LOCATIONS.map((l) => ({ value: l.value, label: l.label, icon: l.icon }));

function TimeAdjuster({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const theme = useTheme();
  const round = {
    width: 44,
    height: 44,
    borderRadius: theme.radii.pill,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };
  return (
    <View style={styles.timeRow}>
      <Text variant="body">{label}</Text>
      <View style={styles.timeControls}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${label}: 30 minutos antes`}
          onPress={() => {
            hapticSelect();
            onChange(Math.max(CALENDAR_DAY_START_MIN, value - CALENDAR_SLOT_MIN));
          }}
          style={round}>
          <Icon name="remove" size={theme.sizes.iconMd} color={theme.colors.text} />
        </Pressable>
        <Text variant="subheading" style={styles.timeValue}>
          {minutesToTime(value)}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${label}: 30 minutos después`}
          onPress={() => {
            hapticSelect();
            onChange(Math.min(CALENDAR_DAY_END_MIN, value + CALENDAR_SLOT_MIN));
          }}
          style={round}>
          <Icon name="add" size={theme.sizes.iconMd} color={theme.colors.text} />
        </Pressable>
      </View>
    </View>
  );
}

export function ActivityEditor({
  mode,
  day,
  initial,
  sameDayBlocks,
  editingId,
  onSave,
  onCancel,
  onDelete,
  onDuplicate,
}: ActivityEditorProps) {
  const theme = useTheme();
  const [values, setValues] = useState<ActivityEditorValues>(initial);

  const validation = useMemo(
    () => validateBlock({ startMinutes: values.startMinutes, endMinutes: values.endMinutes }, sameDayBlocks, editingId),
    [values.startMinutes, values.endMinutes, sameDayBlocks, editingId],
  );

  const patch = (p: Partial<ActivityEditorValues>) => setValues((v) => ({ ...v, ...p }));

  return (
    <SafeArea edges={['top', 'left', 'right', 'bottom']}>
      <View style={[styles.header, { paddingHorizontal: theme.spacing.lg }]}>
        <Text variant="heading">{mode === 'create' ? 'Nueva actividad' : 'Editar actividad'}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Cerrar" onPress={onCancel} hitSlop={12}>
          <Icon name="close" size={theme.sizes.iconLg} color={theme.colors.textMuted} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.content, { paddingHorizontal: theme.spacing.lg }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Text variant="caption" color="textMuted">
          {weekdayLabel(day)}
        </Text>

        <View style={styles.field}>
          <Text variant="bodyStrong">Categoría</Text>
          <ChipGroup
            options={CATEGORY_OPTIONS}
            value={values.category}
            onChange={(category: ActivityCategory) => patch({ category })}
          />
        </View>

        <Field
          label="Título (opcional)"
          placeholder="Ej. Reunión, clase de inglés…"
          value={values.title}
          onChangeText={(title) => patch({ title })}
          maxLength={60}
        />

        <View style={styles.field}>
          <TimeAdjuster label="Inicio" value={values.startMinutes} onChange={(startMinutes) => patch({ startMinutes })} />
          <TimeAdjuster label="Fin" value={values.endMinutes} onChange={(endMinutes) => patch({ endMinutes })} />
        </View>

        {!validation.valid ? (
          <View style={[styles.error, { backgroundColor: theme.colors.dangerMuted, borderRadius: theme.radii.md }]}>
            <Icon name="warning" size={theme.sizes.iconSm} color={theme.colors.danger} />
            <Text variant="caption" color="danger" style={styles.flex}>
              {validation.message}
            </Text>
          </View>
        ) : null}

        <View style={styles.field}>
          <Text variant="bodyStrong">Ubicación (opcional)</Text>
          <ChipGroup
            options={LOCATION_OPTIONS}
            value={values.location ?? null}
            onChange={(location: ActivityLocation) =>
              patch({ location: values.location === location ? undefined : location })
            }
          />
        </View>

        <Field
          variant="multiline"
          label="Notas (opcional)"
          placeholder="Cualquier detalle a recordar"
          value={values.notes}
          onChangeText={(notes) => patch({ notes })}
          maxLength={200}
        />

        <Checkbox
          label="Repetir cada semana"
          checked={values.isRecurringWeekly}
          onChange={(isRecurringWeekly) => patch({ isRecurringWeekly })}
        />

        {mode === 'edit' ? (
          <View style={styles.editActions}>
            {onDuplicate ? (
              <Button title="Copiar a otro día" variant="secondary" size="sm" icon="copy" onPress={onDuplicate} />
            ) : null}
            {onDelete ? (
              <Button title="Eliminar actividad" variant="outline" size="sm" icon="trash" onPress={onDelete} />
            ) : null}
          </View>
        ) : null}
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingHorizontal: theme.spacing.lg, borderTopColor: theme.colors.border, backgroundColor: theme.colors.background },
        ]}>
        <Button
          title={mode === 'create' ? 'Añadir actividad' : 'Guardar cambios'}
          disabled={!validation.valid}
          onPress={() => onSave(values)}
        />
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  content: { paddingBottom: 24, gap: 18 },
  field: { gap: 10 },
  timeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timeControls: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  timeValue: { minWidth: 64, textAlign: 'center' },
  error: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10 },
  editActions: { gap: 10, marginTop: 4 },
  footer: { paddingTop: 12, paddingBottom: 8, borderTopWidth: StyleSheet.hairlineWidth },
});

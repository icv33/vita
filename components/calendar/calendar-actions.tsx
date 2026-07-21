/**
 * CalendarActions — the header "⋯" action menu. Groups the day/week actions with
 * clear labels; destructive ones are styled as danger and confirmed by the
 * caller. The dev-only calendar reset appears only when `onResetCalendar` is set.
 */

import { Pressable, StyleSheet, View } from 'react-native';

import { Icon, Text } from '@/components/ui';
import { useTheme } from '@/hooks/use-theme';
import type { IconName } from '@/theme';
import { weekdayLabel } from '@/utils/date';
import type { Weekday } from '@/types';
import { Sheet } from './sheet';

export type CalendarActionsProps = {
  visible: boolean;
  day: Weekday;
  onClose: () => void;
  onAddActivity: () => void;
  onViewSummary: () => void;
  onCopyDay: () => void;
  onApplyWeekdays: () => void;
  onSettings: () => void;
  onClearDay: () => void;
  onResetWeek: () => void;
  /** Dev-only; when provided a "Reiniciar calendario" row is shown. */
  onResetCalendar?: () => void;
};

type Action = {
  icon: IconName;
  label: string;
  onPress: () => void;
  destructive?: boolean;
};

export function CalendarActions({
  visible,
  day,
  onClose,
  onAddActivity,
  onViewSummary,
  onCopyDay,
  onApplyWeekdays,
  onSettings,
  onClearDay,
  onResetWeek,
  onResetCalendar,
}: CalendarActionsProps) {
  const theme = useTheme();

  const run = (fn: () => void) => () => {
    onClose();
    fn();
  };

  const actions: Action[] = [
    { icon: 'add', label: 'Añadir actividad', onPress: run(onAddActivity) },
    { icon: 'progress', label: 'Ver resumen semanal', onPress: run(onViewSummary) },
    { icon: 'copy', label: `Copiar ${weekdayLabel(day)} a otros días`, onPress: run(onCopyDay) },
    { icon: 'duplicate', label: 'Aplicar de lunes a viernes', onPress: run(onApplyWeekdays) },
    { icon: 'settings', label: 'Ajustes del calendario', onPress: run(onSettings) },
    { icon: 'trash', label: `Vaciar ${weekdayLabel(day)}`, onPress: run(onClearDay), destructive: true },
    { icon: 'refresh', label: 'Restablecer la semana', onPress: run(onResetWeek), destructive: true },
    ...(onResetCalendar
      ? [{ icon: 'logOut' as IconName, label: 'Reiniciar calendario (dev)', onPress: run(onResetCalendar), destructive: true }]
      : []),
  ];

  return (
    <Sheet visible={visible} title="Acciones" onClose={onClose}>
      <View style={styles.list}>
        {actions.map((a) => (
          <Pressable key={a.label} accessibilityRole="button" onPress={a.onPress} style={styles.row}>
            <Icon name={a.icon} size={theme.sizes.iconMd} color={a.destructive ? theme.colors.danger : theme.colors.text} />
            <Text variant="body" color={a.destructive ? 'danger' : 'text'}>
              {a.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  list: { gap: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 13, minHeight: 48 },
});

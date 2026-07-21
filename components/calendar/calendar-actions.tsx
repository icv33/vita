/**
 * CalendarActions — the header "⋯" action menu for the selected day / week.
 * Copy and reset actions; destructive ones are confirmed by the caller.
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
  onCopyDay: () => void;
  onApplyWeekdays: () => void;
  onClearDay: () => void;
  onResetWeek: () => void;
  onViewSummary: () => void;
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
  onCopyDay,
  onApplyWeekdays,
  onClearDay,
  onResetWeek,
  onViewSummary,
}: CalendarActionsProps) {
  const theme = useTheme();

  const run = (fn: () => void) => () => {
    onClose();
    fn();
  };

  const actions: Action[] = [
    { icon: 'copy', label: `Copiar ${weekdayLabel(day)} a otros días`, onPress: run(onCopyDay) },
    { icon: 'duplicate', label: 'Aplicar de lunes a viernes', onPress: run(onApplyWeekdays) },
    { icon: 'progress', label: 'Ver resumen semanal', onPress: run(onViewSummary) },
    { icon: 'trash', label: `Vaciar ${weekdayLabel(day)}`, onPress: run(onClearDay), destructive: true },
    { icon: 'refresh', label: 'Restablecer la semana', onPress: run(onResetWeek), destructive: true },
  ];

  return (
    <Sheet visible={visible} title="Acciones" onClose={onClose}>
      <View style={styles.list}>
        {actions.map((a) => (
          <Pressable
            key={a.label}
            accessibilityRole="button"
            onPress={a.onPress}
            style={styles.row}>
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
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, minHeight: 48 },
});

/**
 * DayPickerSheet — choose one or more days (used to copy a block or a whole day
 * to other days). Excludes the source day.
 */

import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button, Icon, Text } from '@/components/ui';
import { useTheme } from '@/hooks/use-theme';
import { WEEKDAYS, type Weekday } from '@/types';
import { weekdayLabel } from '@/utils/date';
import { toggleInArray } from '@/utils/onboarding';
import { Sheet } from './sheet';

export type DayPickerSheetProps = {
  visible: boolean;
  title: string;
  excludeDay: Weekday;
  mode: 'single' | 'multi';
  onClose: () => void;
  onConfirm: (days: Weekday[]) => void;
};

export function DayPickerSheet({ visible, title, excludeDay, mode, onClose, onConfirm }: DayPickerSheetProps) {
  const theme = useTheme();
  const [selected, setSelected] = useState<Weekday[]>([]);
  const options = WEEKDAYS.filter((d) => d !== excludeDay);

  const toggle = (day: Weekday) => {
    if (mode === 'single') {
      onConfirm([day]);
      setSelected([]);
      return;
    }
    setSelected((s) => toggleInArray(s, day));
  };

  const confirmMulti = () => {
    if (selected.length === 0) return;
    onConfirm(selected);
    setSelected([]);
  };

  return (
    <Sheet visible={visible} title={title} onClose={onClose}>
      <View style={styles.list}>
        {options.map((day) => {
          const isSelected = selected.includes(day);
          return (
            <Pressable
              key={day}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => toggle(day)}
              style={[
                styles.row,
                { borderColor: isSelected ? theme.colors.primary : theme.colors.border, borderRadius: theme.radii.md },
              ]}>
              <Text variant="body" color={isSelected ? 'primary' : 'text'}>
                {weekdayLabel(day)}
              </Text>
              {mode === 'multi' && isSelected ? (
                <Icon name="checkCircle" size={theme.sizes.iconMd} color={theme.colors.primary} />
              ) : null}
            </Pressable>
          );
        })}
      </View>
      {mode === 'multi' ? (
        <Button title="Copiar" onPress={confirmMulti} disabled={selected.length === 0} style={styles.confirm} />
      ) : null}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  list: { gap: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  confirm: { marginTop: 14 },
});

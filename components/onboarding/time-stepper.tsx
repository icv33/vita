/**
 * TimeStepper — pick a time in 30-minute increments without a native date
 * picker (keeps Expo Go happy and adds no dependency). Wraps around midnight.
 */

import { Pressable, StyleSheet, View } from 'react-native';

import { Icon, Text } from '@/components/ui';
import { useTheme } from '@/hooks/use-theme';
import type { TimeString } from '@/types';
import { hapticSelect } from '@/utils/haptics';

const STEP_MIN = 30;
const DAY_MIN = 24 * 60;

function toMinutes(time: TimeString): number {
  const [h, m] = time.split(':').map(Number);
  return (h * 60 + m) % DAY_MIN;
}

function toTime(minutes: number): TimeString {
  const wrapped = ((minutes % DAY_MIN) + DAY_MIN) % DAY_MIN;
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export type TimeStepperProps = {
  value?: TimeString;
  onChange: (value: TimeString) => void;
  /** Used when no value is set yet (first interaction). */
  defaultValue: TimeString;
};

export function TimeStepper({ value, onChange, defaultValue }: TimeStepperProps) {
  const theme = useTheme();
  const base = value ?? defaultValue;

  const shift = (delta: number) => {
    hapticSelect();
    onChange(value == null ? defaultValue : toTime(toMinutes(base) + delta));
  };

  const round = {
    width: 52,
    height: 52,
    borderRadius: theme.radii.pill,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="30 minutos antes"
        onPress={() => shift(-STEP_MIN)}
        style={round}>
        <Icon name="remove" size={theme.sizes.iconMd} color={theme.colors.text} />
      </Pressable>

      <View style={styles.value}>
        <Text variant="display" color={value == null ? 'textSubtle' : 'text'}>
          {base}
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="30 minutos después"
        onPress={() => shift(STEP_MIN)}
        style={round}>
        <Icon name="add" size={theme.sizes.iconMd} color={theme.colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  value: { flex: 1, alignItems: 'center' },
});

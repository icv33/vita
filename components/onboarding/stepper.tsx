/**
 * Stepper — accessible numeric stepper (− value +) for small bounded ranges
 * such as training days per week, meals per day or people to cook for.
 */

import { Pressable, StyleSheet, View } from 'react-native';

import { Icon, Text } from '@/components/ui';
import { useTheme } from '@/hooks/use-theme';
import { hapticSelect } from '@/utils/haptics';

export type StepperProps = {
  value?: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  /** Shown when `value` is undefined, to prompt a first tap. */
  placeholder?: string;
  /** Appended after the value, e.g. "días". */
  suffix?: string;
};

export function Stepper({
  value,
  onChange,
  min,
  max,
  step = 1,
  placeholder = '—',
  suffix,
}: StepperProps) {
  const theme = useTheme();
  const current = value ?? min;
  const canDecrease = value != null && current > min;
  const canIncrease = value == null || current < max;

  const change = (next: number) => {
    hapticSelect();
    onChange(Math.min(max, Math.max(min, next)));
  };

  const round = (disabled: boolean) => ({
    width: 52,
    height: 52,
    borderRadius: theme.radii.pill,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    opacity: disabled ? 0.4 : 1,
  });

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Restar"
        disabled={!canDecrease}
        onPress={() => change(current - step)}
        style={round(!canDecrease)}>
        <Icon name="remove" size={theme.sizes.iconMd} color={theme.colors.text} />
      </Pressable>

      <View style={styles.value}>
        {value == null ? (
          <Text variant="title" color="textSubtle">
            {placeholder}
          </Text>
        ) : (
          <Text variant="display">
            {value}
            {suffix ? <Text variant="subheading" color="textMuted">{` ${suffix}`}</Text> : null}
          </Text>
        )}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Sumar"
        disabled={!canIncrease}
        onPress={() => change((value ?? min - step) + step)}
        style={round(!canIncrease)}>
        <Icon name="add" size={theme.sizes.iconMd} color={theme.colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  value: { flex: 1, alignItems: 'center' },
});

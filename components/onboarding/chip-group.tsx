/**
 * ChipGroup — compact wrapping chips for single or multi-select questions with
 * many short options (equipment, training types, allergies…). Complements the
 * larger `Selector` cards used for primary, descriptive choices.
 */

import { Pressable, StyleSheet, View } from 'react-native';

import { Icon, Text } from '@/components/ui';
import { useTheme } from '@/hooks/use-theme';
import type { IconName } from '@/theme';
import { hapticSelect } from '@/utils/haptics';

export type ChipOption<T extends string> = {
  value: T;
  label: string;
  icon?: IconName;
};

export type ChipGroupProps<T extends string> = {
  options: readonly ChipOption<T>[];
  /** Selected value(s). Pass an array for multi-select. */
  value: T[] | T | null;
  onChange: (value: T) => void;
};

export function ChipGroup<T extends string>({ options, value, onChange }: ChipGroupProps<T>) {
  const theme = useTheme();
  const selected = new Set(Array.isArray(value) ? value : value ? [value] : []);

  return (
    <View style={styles.wrap}>
      {options.map((option) => {
        const isSelected = selected.has(option.value);
        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            hitSlop={6}
            onPress={() => {
              hapticSelect();
              onChange(option.value);
            }}
            style={[
              styles.chip,
              {
                borderRadius: theme.radii.pill,
                backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
                borderColor: isSelected ? theme.colors.primary : theme.colors.border,
              },
            ]}>
            {option.icon ? (
              <Icon
                name={option.icon}
                size={theme.sizes.iconXs}
                color={isSelected ? theme.colors.onPrimary : theme.colors.textMuted}
              />
            ) : null}
            <Text variant="label" color={isSelected ? 'onPrimary' : 'text'}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
    paddingHorizontal: 14,
    borderWidth: 1.5,
  },
});

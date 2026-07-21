/**
 * Selector — a vertical list of selectable options (single or multi select).
 *
 * Mirrors the questionnaire option rows in the product reference: a label with
 * a check indicator, generic over the option value type.
 */

import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Card } from './card';
import { Icon } from './icon';
import { Text } from './text';

export type SelectorOption<T extends string> = {
  value: T;
  label: string;
  description?: string;
};

export type SelectorProps<T extends string> = {
  options: SelectorOption<T>[];
  /** Selected value(s). Array enables multi-select. */
  value: T | T[] | null;
  onChange: (value: T) => void;
};

export function Selector<T extends string>({ options, value, onChange }: SelectorProps<T>) {
  const theme = useTheme();
  const selectedSet = new Set(Array.isArray(value) ? value : value ? [value] : []);

  return (
    <View style={styles.list}>
      {options.map((option) => {
        const selected = selectedSet.has(option.value);
        return (
          <Card
            key={option.value}
            onPress={() => onChange(option.value)}
            padded={false}
            elevation="none"
            style={{
              paddingVertical: theme.spacing.md,
              paddingHorizontal: theme.spacing.lg,
              borderColor: selected ? theme.colors.primary : theme.colors.border,
              backgroundColor: selected ? theme.colors.primaryMuted : theme.colors.card,
            }}>
            <View style={styles.row}>
              <View style={styles.texts}>
                <Text variant="bodyStrong" color={selected ? 'primary' : 'text'}>
                  {option.label}
                </Text>
                {option.description ? (
                  <Text variant="caption" color="textMuted">
                    {option.description}
                  </Text>
                ) : null}
              </View>
              <View
                style={[
                  styles.indicator,
                  {
                    borderColor: selected ? theme.colors.primary : theme.colors.border,
                    backgroundColor: selected ? theme.colors.primary : 'transparent',
                  },
                ]}>
                {selected ? (
                  <Icon name="check" size={14} color={theme.colors.onPrimary} />
                ) : null}
              </View>
            </View>
          </Card>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  texts: { flex: 1, gap: 2 },
  indicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

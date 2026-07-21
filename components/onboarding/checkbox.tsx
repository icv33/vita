/**
 * Checkbox — a labelled, tappable check row used for boolean questions and the
 * review disclaimer/allergy confirmations. Large touch target, accessible state.
 */

import { Pressable, StyleSheet, View } from 'react-native';

import { Icon, Text } from '@/components/ui';
import { useTheme } from '@/hooks/use-theme';
import { hapticSelect } from '@/utils/haptics';

export type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
};

export function Checkbox({ checked, onChange, label, description }: CheckboxProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      onPress={() => {
        hapticSelect();
        onChange(!checked);
      }}
      style={styles.row}>
      <View
        style={[
          styles.box,
          {
            borderRadius: theme.radii.sm,
            borderColor: checked ? theme.colors.primary : theme.colors.border,
            backgroundColor: checked ? theme.colors.primary : 'transparent',
          },
        ]}>
        {checked ? <Icon name="check" size={16} color={theme.colors.onPrimary} /> : null}
      </View>
      <View style={styles.texts}>
        <Text variant="callout">{label}</Text>
        {description ? (
          <Text variant="caption" color="textMuted">
            {description}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 6 },
  box: {
    width: 26,
    height: 26,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  texts: { flex: 1, gap: 2 },
});

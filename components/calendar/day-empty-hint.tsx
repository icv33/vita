/**
 * DayEmptyHint — a compact, single-line, dismissible hint shown over the
 * timeline when the selected day has no activities. It never replaces the
 * timeline (the grid stays visible and tappable underneath); the parent hides
 * it once a block exists. Kept under ~40px tall so it never crowds the hours.
 */

import { Pressable, StyleSheet, View } from 'react-native';

import { Icon, Text } from '@/components/ui';
import { useTheme } from '@/hooks/use-theme';

export type DayEmptyHintProps = {
  onDismiss: () => void;
};

export function DayEmptyHint({ onDismiss }: DayEmptyHintProps) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.radii.md, ...theme.shadows.sm },
      ]}>
      <Icon name="sparkles" size={14} color={theme.colors.primary} />
      <Text variant="caption" color="textMuted" numberOfLines={1} style={styles.text}>
        Día libre · toca una hora para añadir
      </Text>
      <Pressable accessibilityRole="button" accessibilityLabel="Ocultar" hitSlop={10} onPress={onDismiss}>
        <Icon name="close" size={14} color={theme.colors.textSubtle} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  text: { flex: 1 },
});

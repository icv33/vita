/**
 * DayEmptyHint — a small, dismissible hint shown over the timeline when the
 * selected day has no activities. It never replaces the timeline (the grid stays
 * visible and tappable); the parent hides it once a block exists.
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
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.radii.lg, ...theme.shadows.md },
      ]}>
      <Icon name="sparkles" size={theme.sizes.iconSm} color={theme.colors.primary} />
      <Text variant="caption" color="textMuted" style={styles.text}>
        Tu día está libre. Toca una hora para añadir una actividad.
      </Text>
      <Pressable accessibilityRole="button" accessibilityLabel="Ocultar" hitSlop={10} onPress={onDismiss}>
        <Icon name="close" size={theme.sizes.iconSm} color={theme.colors.textSubtle} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  text: { flex: 1 },
});

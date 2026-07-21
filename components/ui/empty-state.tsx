/**
 * EmptyState — friendly placeholder for empty lists / not-yet-built sections.
 * Icon + title + optional description and call-to-action.
 */

import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import type { IconName } from '@/theme';
import { Button } from './button';
import { Icon } from './icon';
import { Text } from './text';

export type EmptyStateProps = {
  icon?: IconName;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  icon = 'empty',
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: theme.colors.surfaceAlt, borderRadius: theme.radii.full },
        ]}>
        <Icon name={icon} size={theme.sizes.iconXl} color={theme.colors.textSubtle} />
      </View>
      <Text variant="subheading" center>
        {title}
      </Text>
      {description ? (
        <Text variant="body" color="textMuted" center>
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button title={actionLabel} onPress={onAction} fullWidth={false} style={styles.action} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  iconWrap: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  action: { marginTop: 8 },
});

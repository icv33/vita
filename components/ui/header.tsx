/**
 * Header — a screen header with a title, optional subtitle, optional back
 * button and an optional right-side action slot.
 */

import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Icon } from './icon';
import { Text } from './text';

export type HeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
};

export function Header({ title, subtitle, onBack, right }: HeaderProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { paddingVertical: theme.spacing.sm }]}>
      {onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver"
          onPress={onBack}
          hitSlop={12}
          style={styles.back}>
          <Icon name="chevronLeft" size={theme.sizes.iconLg} color={theme.colors.text} />
        </Pressable>
      ) : null}

      <View style={styles.titles}>
        <Text variant="title">{title}</Text>
        {subtitle ? (
          <Text variant="callout" color="textMuted">
            {subtitle}
          </Text>
        ) : null}
      </View>

      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  back: { marginLeft: -4 },
  titles: { flex: 1, gap: 2 },
  right: { marginLeft: 'auto' },
});

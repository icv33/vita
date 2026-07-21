/**
 * Screen — the standard shell every screen sits in.
 *
 * Handles safe-area insets, background color, consistent horizontal padding and
 * an optional scroll container. Use `scroll` for content-heavy screens and the
 * static variant for full-height layouts (e.g. a centered empty state).
 */

import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import type { Edge } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';
import { SafeArea } from './safe-area';

export type ScreenProps = {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  edges?: Edge[];
  background?: string;
  contentStyle?: ViewStyle;
};

export function Screen({
  children,
  scroll = false,
  padded = true,
  edges = ['top', 'left', 'right'],
  background,
  contentStyle,
}: ScreenProps) {
  const theme = useTheme();
  const padding: ViewStyle = padded ? { paddingHorizontal: theme.spacing.lg } : {};

  return (
    <SafeArea edges={edges} background={background}>
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            { paddingBottom: theme.spacing.xxxl },
            padding,
            contentStyle,
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, padding, contentStyle]}>{children}</View>
      )}
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});

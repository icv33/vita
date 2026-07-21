/**
 * SafeArea — a themed container that respects iOS/Android safe-area insets.
 * Low-level building block used by `Screen`; can also be used directly.
 */

import { View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets, type Edge } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';

export type SafeAreaProps = {
  children: React.ReactNode;
  edges?: Edge[];
  background?: string;
  style?: ViewStyle;
};

export function SafeArea({
  children,
  edges = ['top', 'bottom', 'left', 'right'],
  background,
  style,
}: SafeAreaProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: background ?? theme.colors.background,
          paddingTop: edges.includes('top') ? insets.top : 0,
          paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
          paddingLeft: edges.includes('left') ? insets.left : 0,
          paddingRight: edges.includes('right') ? insets.right : 0,
        },
        style,
      ]}>
      {children}
    </View>
  );
}

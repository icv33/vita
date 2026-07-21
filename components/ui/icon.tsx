/**
 * Icon — renders a semantic Vita icon (see `theme/icons.ts`) via Ionicons.
 * Using the semantic name keeps screens decoupled from the icon set.
 */

import Ionicons from '@expo/vector-icons/Ionicons';
import type { StyleProp, TextStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { icons, type IconName } from '@/theme';

export type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

export function Icon({ name, size, color, style }: IconProps) {
  const theme = useTheme();
  return (
    <Ionicons
      name={icons[name]}
      size={size ?? theme.sizes.iconMd}
      color={color ?? theme.colors.text}
      style={style}
    />
  );
}

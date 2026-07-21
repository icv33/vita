/**
 * Text — the single text primitive for Vita.
 *
 * Applies a typographic `variant` and a semantic `color` token from the theme,
 * so screens never hardcode font sizes or hex colors.
 */

import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import type { ThemeColors, TextVariant } from '@/theme';

export type TextColor = keyof Pick<
  ThemeColors,
  | 'text'
  | 'textMuted'
  | 'textSubtle'
  | 'textInverted'
  | 'primary'
  | 'accent'
  | 'success'
  | 'danger'
  | 'warning'
  | 'onPrimary'
  | 'onAccent'
>;

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  color?: TextColor;
  center?: boolean;
};

export function Text({
  variant = 'body',
  color = 'text',
  center = false,
  style,
  ...rest
}: TextProps) {
  const theme = useTheme();
  return (
    <RNText
      style={[
        theme.typography[variant],
        { color: theme.colors[color] },
        center && { textAlign: 'center' },
        style,
      ]}
      {...rest}
    />
  );
}

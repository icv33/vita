/**
 * Button — primary interactive control.
 *
 * Variants: primary (filled blue), secondary (filled neutral), outline, ghost.
 * Honors the minimum touch target, shows a pressed state, supports loading and
 * disabled states, an optional leading icon, and full-width layout.
 */

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import type { IconName } from '@/theme';
import { Icon } from './icon';
import { Text, type TextColor } from './text';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = Omit<PressableProps, 'style'> & {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
};

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  fullWidth = true,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  const height =
    size === 'sm' ? theme.sizes.buttonSm : size === 'lg' ? theme.sizes.buttonLg : theme.sizes.buttonMd;

  const bg: Record<ButtonVariant, string> = {
    primary: theme.colors.primary,
    secondary: theme.colors.surfaceAlt,
    outline: 'transparent',
    ghost: 'transparent',
  };

  const fg: Record<ButtonVariant, TextColor> = {
    primary: 'onPrimary',
    secondary: 'text',
    outline: 'primary',
    ghost: 'primary',
  };

  const border = variant === 'outline' ? theme.colors.primary : 'transparent';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      hitSlop={8}
      style={({ pressed }) => [
        styles.base,
        {
          height,
          minHeight: height,
          paddingHorizontal: theme.spacing.xl,
          backgroundColor: bg[variant],
          borderRadius: theme.radii.lg,
          borderWidth: variant === 'outline' ? 1.5 : 0,
          borderColor: border,
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        style,
      ]}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={theme.colors[fg[variant]]} />
      ) : (
        <View style={styles.content}>
          {icon ? <Icon name={icon} size={theme.sizes.iconSm} color={theme.colors[fg[variant]]} /> : null}
          <Text variant="bodyStrong" color={fg[variant]}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

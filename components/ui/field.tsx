/**
 * Field — a labelled text input with optional helper/error text.
 * Wraps RN TextInput with themed styling and accessible sizing.
 */

import { useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Text } from './text';

export type FieldProps = TextInputProps & {
  label?: string;
  helper?: string;
  error?: string;
};

export function Field({ label, helper, error, style, onFocus, onBlur, ...rest }: FieldProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const hasError = Boolean(error);

  const borderColor = hasError
    ? theme.colors.danger
    : focused
      ? theme.colors.primary
      : theme.colors.border;

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text variant="label" color="textMuted" style={styles.label}>
          {label}
        </Text>
      ) : null}
      <TextInput
        placeholderTextColor={theme.colors.textSubtle}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[
          theme.typography.body,
          {
            height: theme.sizes.fieldHeight,
            paddingHorizontal: theme.spacing.lg,
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radii.lg,
            borderWidth: 1.5,
            borderColor,
            color: theme.colors.text,
          },
          style,
        ]}
        {...rest}
      />
      {hasError ? (
        <Text variant="caption" color="danger" style={styles.helper}>
          {error}
        </Text>
      ) : helper ? (
        <Text variant="caption" color="textSubtle" style={styles.helper}>
          {helper}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: { marginLeft: 2 },
  helper: { marginLeft: 2 },
});

/**
 * Field — a labelled text input with optional helper/error text.
 *
 * Variants:
 *  - `default`  single-line, compact and vertically centered (56pt).
 *  - `compact`  denser single-line (48pt) — still above the touch minimum.
 *  - `multiline` taller, top-aligned, grows with content.
 *
 * Single-line variants deliberately do NOT set a `lineHeight` on the input:
 * applying the body `lineHeight` (24) to a fixed-height single-line TextInput
 * inflates the glyph box and — together with each platform's default vertical
 * padding — leaves a lot of empty space above/below the value and pushes it
 * off-center. Instead we center with the input height, zero the vertical
 * padding, set `textAlignVertical: 'center'` and disable Android font padding.
 */

import { useState } from 'react';
import { Platform, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Text } from './text';

export type FieldVariant = 'default' | 'compact' | 'multiline';

export type FieldProps = TextInputProps & {
  label?: string;
  helper?: string;
  error?: string;
  variant?: FieldVariant;
};

export function Field({
  label,
  helper,
  error,
  variant,
  multiline,
  style,
  onFocus,
  onBlur,
  ...rest
}: FieldProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const hasError = Boolean(error);

  // Auto-select the multiline variant when `multiline` is set and no explicit variant.
  const resolved: FieldVariant = variant ?? (multiline ? 'multiline' : 'default');
  const isMultiline = resolved === 'multiline';

  const borderColor = hasError
    ? theme.colors.danger
    : focused
      ? theme.colors.primary
      : theme.colors.border;

  const shared = {
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.body.fontWeight,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    // Border width is constant; only the color changes on focus → no size jump.
    borderWidth: 1.5,
    borderColor,
    color: theme.colors.text,
    includeFontPadding: false as const,
  };

  const singleLine = {
    ...shared,
    height: resolved === 'compact' ? theme.sizes.fieldHeightCompact : theme.sizes.fieldHeight,
    minHeight: 48,
    paddingVertical: 0,
    textAlignVertical: 'center' as const,
  };

  const multilineStyle = {
    ...shared,
    minHeight: theme.sizes.fieldMinHeightMultiline,
    lineHeight: 22,
    paddingTop: Platform.OS === 'ios' ? 14 : 12,
    paddingBottom: 14,
    textAlignVertical: 'top' as const,
  };

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text variant="label" color="textMuted" style={styles.label}>
          {label}
        </Text>
      ) : null}
      <TextInput
        placeholderTextColor={theme.colors.textSubtle}
        multiline={isMultiline}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[isMultiline ? multilineStyle : singleLine, style]}
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

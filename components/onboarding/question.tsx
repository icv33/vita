/**
 * Question — a labelled block grouping a single question with its control.
 * Keeps step screens tidy when they hold several sub-questions.
 */

import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';

export type QuestionProps = {
  label: string;
  hint?: string;
  optional?: boolean;
  children: React.ReactNode;
};

export function Question({ label, hint, optional, children }: QuestionProps) {
  return (
    <View style={styles.block}>
      <View style={styles.labelRow}>
        <Text variant="bodyStrong">{label}</Text>
        {optional ? (
          <Text variant="caption" color="textSubtle">
            {'  '}Opcional
          </Text>
        ) : null}
      </View>
      {hint ? (
        <Text variant="caption" color="textMuted" style={styles.hint}>
          {hint}
        </Text>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: 10 },
  labelRow: { flexDirection: 'row', alignItems: 'baseline' },
  hint: { marginTop: -4 },
});

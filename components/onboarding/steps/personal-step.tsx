import { StyleSheet, View } from 'react-native';

import { Card, Field, Icon, Selector, Text } from '@/components/ui';
import { Question } from '@/components/onboarding/question';
import { SEXES, type Sex } from '@/constants';
import { useTheme } from '@/hooks/use-theme';
import { personalFieldErrors } from '@/validation';
import { hapticSelect } from '@/utils/haptics';
import { needsTargetWeight } from '@/utils/onboarding';
import type { StepProps } from './types';

/** Parse a user-typed number (comma or dot), returning undefined when empty. */
function parseNumber(text: string): number | undefined {
  const cleaned = text.replace(',', '.').replace(/[^0-9.]/g, '');
  if (cleaned === '') return undefined;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : undefined;
}

export function PersonalStep({ answers, update }: StepProps) {
  const theme = useTheme();
  const errors = personalFieldErrors(answers);
  const isMinor = answers.age != null && answers.age < 18;

  // Only surface an inline error once the user has typed something.
  const show = (value: number | undefined, error?: string) =>
    value != null ? error : undefined;

  return (
    <>
      <Field
        label="Edad"
        placeholder="Ej. 28"
        keyboardType="number-pad"
        value={answers.age != null ? String(answers.age) : ''}
        onChangeText={(t) => update({ age: parseNumber(t) })}
        maxLength={3}
        error={show(answers.age, errors.age)}
      />

      {isMinor ? (
        <Card elevation="none" style={[styles.warning, { backgroundColor: theme.colors.accentMuted }]}>
          <Icon name="info" size={theme.sizes.iconMd} color={theme.colors.warning} />
          <Text variant="caption" color="textMuted" style={styles.warningText}>
            Vita es una herramienta de bienestar y planificación, no sustituye la supervisión de
            un profesional. No hacemos cálculos médicos ni dietas restrictivas.
          </Text>
        </Card>
      ) : null}

      <Question label="Sexo" hint="Solo lo usamos para estimar tus necesidades energéticas.">
        <Selector
          options={SEXES}
          value={answers.sex ?? null}
          onChange={(sex: Sex) => {
            hapticSelect();
            update({ sex });
          }}
        />
      </Question>

      <View style={styles.rowFields}>
        <View style={styles.half}>
          <Field
            label="Altura (cm)"
            placeholder="Ej. 168"
            keyboardType="number-pad"
            value={answers.heightCm != null ? String(answers.heightCm) : ''}
            onChangeText={(t) => update({ heightCm: parseNumber(t) })}
            maxLength={3}
            error={show(answers.heightCm, errors.heightCm)}
          />
        </View>
        <View style={styles.half}>
          <Field
            label="Peso (kg)"
            placeholder="Ej. 62"
            keyboardType="decimal-pad"
            value={answers.weightKg != null ? String(answers.weightKg) : ''}
            onChangeText={(t) => update({ weightKg: parseNumber(t) })}
            maxLength={5}
            error={show(answers.weightKg, errors.weightKg)}
          />
        </View>
      </View>

      {needsTargetWeight(answers) ? (
        <Field
          label="Peso objetivo (kg)"
          placeholder="Opcional"
          keyboardType="decimal-pad"
          value={answers.targetWeightKg != null ? String(answers.targetWeightKg) : ''}
          onChangeText={(t) => update({ targetWeightKg: parseNumber(t) })}
          maxLength={5}
          error={show(answers.targetWeightKg, errors.targetWeightKg)}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  warning: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  warningText: { flex: 1 },
  rowFields: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
});

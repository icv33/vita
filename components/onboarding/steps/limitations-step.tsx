import { StyleSheet } from 'react-native';

import { Field, Text } from '@/components/ui';
import type { StepProps } from './types';

export function LimitationsStep({ answers, update }: StepProps) {
  return (
    <>
      <Field
        placeholder="Ej. molestia en la rodilla, hombro sensible…"
        value={answers.physicalLimitations ?? ''}
        onChangeText={(physicalLimitations) => update({ physicalLimitations })}
        multiline
        numberOfLines={4}
        maxLength={300}
        style={styles.textArea}
      />
      <Text variant="caption" color="textSubtle">
        Nos ayuda a adaptar los ejercicios. Vita no ofrece diagnósticos ni recomendaciones
        médicas: si tienes una lesión, consulta con un profesional.
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  textArea: { height: 120, paddingTop: 14, textAlignVertical: 'top' },
});

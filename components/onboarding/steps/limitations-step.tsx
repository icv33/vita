import { Field, Text } from '@/components/ui';
import type { StepProps } from './types';

export function LimitationsStep({ answers, update }: StepProps) {
  return (
    <>
      <Field
        variant="multiline"
        placeholder="Ej. molestia en la rodilla, hombro sensible…"
        value={answers.physicalLimitations ?? ''}
        onChangeText={(physicalLimitations) => update({ physicalLimitations })}
        numberOfLines={4}
        maxLength={300}
      />
      <Text variant="caption" color="textSubtle">
        Nos ayuda a adaptar los ejercicios. Vita no ofrece diagnósticos ni recomendaciones
        médicas: si tienes una lesión, consulta con un profesional.
      </Text>
    </>
  );
}

import { Field } from '@/components/ui';
import type { StepProps } from './types';

export function NameStep({ answers, update }: StepProps) {
  return (
    <Field
      label="Nombre o apodo"
      placeholder="Escribe tu nombre"
      value={answers.name ?? ''}
      onChangeText={(name) => update({ name })}
      autoCapitalize="words"
      autoCorrect={false}
      maxLength={30}
      returnKeyType="done"
      helper="Lo usaremos para saludarte en Inicio."
    />
  );
}

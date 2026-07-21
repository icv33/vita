import { Field } from '@/components/ui';
import { ChipGroup } from '@/components/onboarding/chip-group';
import { Question } from '@/components/onboarding/question';
import { TRAINING_TYPES, type TrainingType } from '@/constants';
import { toggleInArray } from '@/utils/onboarding';
import type { StepProps } from './types';

export function TrainingStep({ answers, update }: StepProps) {
  return (
    <>
      <Question label="Tipos de entrenamiento preferidos" optional hint="Elige los que más te gusten.">
        <ChipGroup
          options={TRAINING_TYPES}
          value={answers.trainingTypes ?? []}
          onChange={(t: TrainingType) => update({ trainingTypes: toggleInArray(answers.trainingTypes, t) })}
        />
      </Question>

      <Question label="¿Practicas algún deporte actualmente?" optional>
        <Field
          placeholder="Ej. pádel, natación…"
          value={answers.currentSports ?? ''}
          onChangeText={(currentSports) => update({ currentSports })}
          maxLength={120}
        />
      </Question>

      <Question label="¿Hay ejercicios que no te gustan?" optional>
        <Field
          placeholder="Ej. burpees, correr…"
          value={answers.dislikedExercises ?? ''}
          onChangeText={(dislikedExercises) => update({ dislikedExercises })}
          maxLength={120}
        />
      </Question>
    </>
  );
}

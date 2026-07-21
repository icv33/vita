import { Selector } from '@/components/ui';
import { Question } from '@/components/onboarding/question';
import { Stepper } from '@/components/onboarding/stepper';
import { SESSION_DURATIONS, type SessionDuration } from '@/constants';
import { hapticSelect } from '@/utils/haptics';
import type { StepProps } from './types';

export function AvailabilityStep({ answers, update }: StepProps) {
  return (
    <>
      <Question label="¿Cuántos días quieres entrenar por semana?">
        <Stepper
          value={answers.trainingDaysPerWeek}
          onChange={(trainingDaysPerWeek) => update({ trainingDaysPerWeek })}
          min={1}
          max={7}
          suffix="días"
          placeholder="Elige"
        />
      </Question>

      <Question label="Duración preferida por sesión">
        <Selector
          options={SESSION_DURATIONS}
          value={answers.sessionDuration ?? null}
          onChange={(sessionDuration: SessionDuration) => {
            hapticSelect();
            update({ sessionDuration });
          }}
        />
      </Question>
    </>
  );
}

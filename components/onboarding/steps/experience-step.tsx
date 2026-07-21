import { Selector } from '@/components/ui';
import { TRAINING_LEVELS, type TrainingLevel } from '@/constants';
import { hapticSelect } from '@/utils/haptics';
import type { StepProps } from './types';

export function ExperienceStep({ answers, update }: StepProps) {
  return (
    <Selector
      options={TRAINING_LEVELS}
      value={answers.trainingLevel ?? null}
      onChange={(trainingLevel: TrainingLevel) => {
        hapticSelect();
        update({ trainingLevel });
      }}
    />
  );
}

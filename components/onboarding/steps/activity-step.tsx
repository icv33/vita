import { Selector } from '@/components/ui';
import { ChipGroup } from '@/components/onboarding/chip-group';
import { Question } from '@/components/onboarding/question';
import {
  ACTIVITY_TYPES,
  DAILY_STEPS,
  OCCUPATIONS,
  type ActivityType,
  type DailyStepsRange,
  type Occupation,
} from '@/constants';
import { hapticSelect } from '@/utils/haptics';
import type { StepProps } from './types';

export function ActivityStep({ answers, update }: StepProps) {
  const choose = (patch: Partial<typeof answers>) => {
    hapticSelect();
    update(patch);
  };

  return (
    <>
      <Question label="¿Cuál es tu ocupación principal?">
        <Selector
          options={OCCUPATIONS}
          value={answers.occupation ?? null}
          onChange={(occupation: Occupation) => choose({ occupation })}
        />
      </Question>

      <Question label="¿Cómo es tu actividad habitual?">
        <Selector
          options={ACTIVITY_TYPES}
          value={answers.activityType ?? null}
          onChange={(activityType: ActivityType) => choose({ activityType })}
        />
      </Question>

      <Question label="Pasos diarios aproximados" optional>
        <ChipGroup
          options={DAILY_STEPS}
          value={answers.dailySteps ?? null}
          onChange={(dailySteps: DailyStepsRange) => update({ dailySteps })}
        />
      </Question>
    </>
  );
}

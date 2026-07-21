import { Field, Selector } from '@/components/ui';
import { Question } from '@/components/onboarding/question';
import { Stepper } from '@/components/onboarding/stepper';
import { DIET_TYPES, type DietType } from '@/constants';
import { hapticSelect } from '@/utils/haptics';
import { needsDietOther } from '@/utils/onboarding';
import type { StepProps } from './types';

export function NutritionStep({ answers, update }: StepProps) {
  const selectDiet = (dietType: DietType) => {
    hapticSelect();
    const patch: Partial<typeof answers> = { dietType };
    if (dietType !== 'other') patch.dietTypeOther = undefined;
    update(patch);
  };

  return (
    <>
      <Question label="¿Cuántas comidas haces al día?">
        <Stepper
          value={answers.mealsPerDay}
          onChange={(mealsPerDay) => update({ mealsPerDay })}
          min={1}
          max={8}
          suffix="comidas"
          placeholder="Elige"
        />
      </Question>

      <Question label="Tipo de alimentación">
        <Selector options={DIET_TYPES} value={answers.dietType ?? null} onChange={selectDiet} />
      </Question>

      {needsDietOther(answers) ? (
        <Field
          label="¿Cuál?"
          placeholder="Describe tu tipo de alimentación"
          value={answers.dietTypeOther ?? ''}
          onChangeText={(dietTypeOther) => update({ dietTypeOther })}
          maxLength={60}
        />
      ) : null}
    </>
  );
}

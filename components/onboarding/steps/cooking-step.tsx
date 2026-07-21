import { Field, Selector } from '@/components/ui';
import { ChipGroup } from '@/components/onboarding/chip-group';
import { Checkbox } from '@/components/onboarding/checkbox';
import { Question } from '@/components/onboarding/question';
import { Stepper } from '@/components/onboarding/stepper';
import {
  APPLIANCES,
  COOKING_LEVELS,
  COOKING_TIMES,
  type Appliance,
  type CookingLevel,
  type CookingTime,
} from '@/constants';
import { budgetError } from '@/validation';
import { hapticSelect } from '@/utils/haptics';
import { toggleInArray } from '@/utils/onboarding';
import type { StepProps } from './types';

function parseInt10(text: string): number | undefined {
  const cleaned = text.replace(/[^0-9]/g, '');
  return cleaned === '' ? undefined : Number(cleaned);
}

export function CookingStep({ answers, update }: StepProps) {
  return (
    <>
      <Question label="¿Cuánto tiempo tienes para cocinar?">
        <Selector
          options={COOKING_TIMES}
          value={answers.cookingTime ?? null}
          onChange={(cookingTime: CookingTime) => {
            hapticSelect();
            update({ cookingTime });
          }}
        />
      </Question>

      <Question label="Nivel de cocina">
        <ChipGroup
          options={COOKING_LEVELS}
          value={answers.cookingLevel ?? null}
          onChange={(cookingLevel: CookingLevel) => update({ cookingLevel })}
        />
      </Question>

      <Question label="¿Para cuántas personas cocinas?">
        <Stepper
          value={answers.peopleToCookFor}
          onChange={(peopleToCookFor) => update({ peopleToCookFor })}
          min={1}
          max={12}
          suffix="personas"
          placeholder="Elige"
        />
      </Question>

      <Checkbox
        label="Quiero indicar un presupuesto semanal"
        checked={answers.wantsBudget ?? false}
        onChange={(wantsBudget) =>
          update(wantsBudget ? { wantsBudget } : { wantsBudget, weeklyBudgetEuros: undefined, supermarket: undefined })
        }
      />

      {answers.wantsBudget ? (
        <>
          <Field
            label="Presupuesto semanal (€)"
            placeholder="Ej. 60"
            keyboardType="number-pad"
            value={answers.weeklyBudgetEuros != null ? String(answers.weeklyBudgetEuros) : ''}
            onChangeText={(t) => update({ weeklyBudgetEuros: parseInt10(t) })}
            maxLength={4}
            error={answers.weeklyBudgetEuros != null ? budgetError(answers) : undefined}
          />
          <Field
            label="Supermercado habitual"
            placeholder="Opcional"
            value={answers.supermarket ?? ''}
            onChangeText={(supermarket) => update({ supermarket })}
            maxLength={60}
          />
        </>
      ) : null}

      <Question label="Electrodomésticos disponibles" optional>
        <ChipGroup
          options={APPLIANCES}
          value={answers.appliances ?? []}
          onChange={(a: Appliance) => update({ appliances: toggleInArray(answers.appliances, a) })}
        />
      </Question>
    </>
  );
}

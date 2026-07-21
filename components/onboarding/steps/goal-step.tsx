import { Field, Selector } from '@/components/ui';
import { Question } from '@/components/onboarding/question';
import { ChipGroup } from '@/components/onboarding/chip-group';
import { PRIMARY_GOALS, SECONDARY_GOALS, type PrimaryGoal } from '@/constants';
import { hapticSelect } from '@/utils/haptics';
import { needsTargetSport, toggleInArray } from '@/utils/onboarding';
import type { StepProps } from './types';

export function GoalStep({ answers, update }: StepProps) {
  const selectPrimary = (primaryGoal: PrimaryGoal) => {
    hapticSelect();
    // Clear adaptive fields that no longer apply.
    const patch: Parameters<typeof update>[0] = { primaryGoal };
    if (primaryGoal !== 'prepare_event') patch.targetSport = undefined;
    if (primaryGoal !== 'lose_fat' && primaryGoal !== 'gain_muscle') patch.targetWeightKg = undefined;
    update(patch);
  };

  return (
    <>
      <Selector
        options={PRIMARY_GOALS}
        value={answers.primaryGoal ?? null}
        onChange={selectPrimary}
      />

      {needsTargetSport(answers) ? (
        <Field
          label="¿Qué prueba o deporte?"
          placeholder="Ej. maratón, oposición, fútbol…"
          value={answers.targetSport ?? ''}
          onChangeText={(targetSport) => update({ targetSport })}
          maxLength={60}
        />
      ) : null}

      <Question label="Objetivos secundarios" optional hint="Puedes elegir varios.">
        <ChipGroup
          options={SECONDARY_GOALS}
          value={answers.secondaryGoals ?? []}
          onChange={(v) => update({ secondaryGoals: toggleInArray(answers.secondaryGoals, v) })}
        />
      </Question>
    </>
  );
}

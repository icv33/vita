/**
 * Onboarding step validation.
 *
 * `isStepComplete` gates the "Continuar" button per step (required fields).
 * The `*FieldErrors` helpers return inline messages for steps that need them.
 * Pure functions built on the generic validators — easy to test.
 */

import type { OnboardingAnswers } from '@/types';
import { needsDietOther, needsTargetWeight } from '@/utils/onboarding';
import {
  isNumberInRange,
  validateAge,
  validateBudget,
  validateHeightCm,
  validateName,
  validateWeightKg,
} from './validators';

/** Inline errors for the personal-data step. */
export type PersonalFieldErrors = {
  age?: string;
  heightCm?: string;
  weightKg?: string;
  targetWeightKg?: string;
};

export function personalFieldErrors(a: OnboardingAnswers): PersonalFieldErrors {
  const errors: PersonalFieldErrors = {};
  const age = validateAge(a.age);
  if (!age.valid) errors.age = age.message;
  const height = validateHeightCm(a.heightCm);
  if (!height.valid) errors.heightCm = height.message;
  const weight = validateWeightKg(a.weightKg);
  if (!weight.valid) errors.weightKg = weight.message;
  // Target weight is optional; only validate when the goal needs it AND it's set.
  if (needsTargetWeight(a) && a.targetWeightKg != null) {
    const target = validateWeightKg(a.targetWeightKg);
    if (!target.valid) errors.targetWeightKg = target.message;
  }
  return errors;
}

/** Budget error for the cooking step (only when the user opts into a budget). */
export function budgetError(a: OnboardingAnswers): string | undefined {
  if (!a.wantsBudget) return undefined;
  const result = validateBudget(a.weeklyBudgetEuros);
  return result.valid ? undefined : result.message;
}

/** True when the required fields for `stepId` are satisfied. */
export function isStepComplete(stepId: string, a: OnboardingAnswers): boolean {
  switch (stepId) {
    case 'name':
      return validateName(a.name).valid;

    case 'goal':
      return Boolean(a.primaryGoal);

    case 'personal':
      return Object.keys(personalFieldErrors(a)).length === 0 && Boolean(a.sex);

    case 'activity':
      return Boolean(a.occupation) && Boolean(a.activityType);

    case 'experience':
      return Boolean(a.trainingLevel);

    case 'availability':
      return isNumberInRange(a.trainingDaysPerWeek, 1, 7) && Boolean(a.sessionDuration);

    case 'place':
      return Array.isArray(a.trainingPlaces) && a.trainingPlaces.length > 0;

    case 'training':
      // Optional preferences — always allowed to continue.
      return true;

    case 'limitations':
      // Optional free text.
      return true;

    case 'nutrition':
      return (
        isNumberInRange(a.mealsPerDay, 1, 10) &&
        Boolean(a.dietType) &&
        (!needsDietOther(a) || Boolean(a.dietTypeOther && a.dietTypeOther.trim()))
      );

    case 'restrictions':
      // All optional.
      return true;

    case 'cooking':
      return (
        Boolean(a.cookingTime) &&
        Boolean(a.cookingLevel) &&
        isNumberInRange(a.peopleToCookFor, 1, 20) &&
        budgetError(a) === undefined
      );

    case 'lifestyle':
      return (
        Boolean(a.wakeUpTime) &&
        Boolean(a.bedTime) &&
        Boolean(a.sleepQuality) &&
        Boolean(a.stressLevel) &&
        Boolean(a.preferredTrainingTime)
      );

    case 'review':
      // Confirmation (disclaimer + allergy ack) handled in the review screen.
      return true;

    default:
      return true;
  }
}

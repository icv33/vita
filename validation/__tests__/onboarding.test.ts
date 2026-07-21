import type { OnboardingAnswers } from '@/types';
import { budgetError, isStepComplete, personalFieldErrors } from '@/validation';

describe('personalFieldErrors', () => {
  it('flags invalid numbers', () => {
    const errors = personalFieldErrors({ age: 5, heightCm: 50, weightKg: 10 });
    expect(errors.age).toBeDefined();
    expect(errors.heightCm).toBeDefined();
    expect(errors.weightKg).toBeDefined();
  });

  it('passes valid data with no errors', () => {
    const errors = personalFieldErrors({ age: 28, heightCm: 168, weightKg: 62 });
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('validates target weight only when the goal needs it', () => {
    // maintain: target weight ignored even if silly.
    expect(personalFieldErrors({ age: 28, heightCm: 168, weightKg: 62, primaryGoal: 'maintain', targetWeightKg: 1 }).targetWeightKg).toBeUndefined();
    // lose_fat: invalid target weight flagged.
    expect(personalFieldErrors({ age: 28, heightCm: 168, weightKg: 62, primaryGoal: 'lose_fat', targetWeightKg: 1 }).targetWeightKg).toBeDefined();
  });
});

describe('budgetError', () => {
  it('is undefined when the user does not want a budget', () => {
    expect(budgetError({ wantsBudget: false, weeklyBudgetEuros: 0 })).toBeUndefined();
    expect(budgetError({})).toBeUndefined();
  });

  it('validates the amount when a budget is requested', () => {
    expect(budgetError({ wantsBudget: true, weeklyBudgetEuros: 60 })).toBeUndefined();
    expect(budgetError({ wantsBudget: true, weeklyBudgetEuros: 0 })).toBeDefined();
    expect(budgetError({ wantsBudget: true })).toBeDefined();
  });
});

describe('isStepComplete', () => {
  const base: OnboardingAnswers = {};

  it('name requires a valid name', () => {
    expect(isStepComplete('name', { name: '' })).toBe(false);
    expect(isStepComplete('name', { name: 'A' })).toBe(false);
    expect(isStepComplete('name', { name: 'Ana' })).toBe(true);
  });

  it('goal requires a primary goal', () => {
    expect(isStepComplete('goal', base)).toBe(false);
    expect(isStepComplete('goal', { primaryGoal: 'lose_fat' })).toBe(true);
  });

  it('personal requires valid metrics and sex', () => {
    expect(isStepComplete('personal', { age: 28, heightCm: 168, weightKg: 62 })).toBe(false);
    expect(isStepComplete('personal', { age: 28, heightCm: 168, weightKg: 62, sex: 'female' })).toBe(true);
  });

  it('availability requires days in range and a duration', () => {
    expect(isStepComplete('availability', { trainingDaysPerWeek: 3 })).toBe(false);
    expect(isStepComplete('availability', { trainingDaysPerWeek: 0, sessionDuration: '30_45' })).toBe(false);
    expect(isStepComplete('availability', { trainingDaysPerWeek: 3, sessionDuration: '30_45' })).toBe(true);
  });

  it('place requires at least one place', () => {
    expect(isStepComplete('place', { trainingPlaces: [] })).toBe(false);
    expect(isStepComplete('place', { trainingPlaces: ['home'] })).toBe(true);
  });

  it('nutrition requires meals, diet and the "other" detail when relevant', () => {
    expect(isStepComplete('nutrition', { mealsPerDay: 4, dietType: 'none' })).toBe(true);
    expect(isStepComplete('nutrition', { mealsPerDay: 4, dietType: 'other' })).toBe(false);
    expect(isStepComplete('nutrition', { mealsPerDay: 4, dietType: 'other', dietTypeOther: 'keto' })).toBe(true);
  });

  it('cooking requires time, level, people and a valid budget when requested', () => {
    const ok: OnboardingAnswers = { cookingTime: '15_30', cookingLevel: 'basic', peopleToCookFor: 2 };
    expect(isStepComplete('cooking', ok)).toBe(true);
    expect(isStepComplete('cooking', { ...ok, wantsBudget: true })).toBe(false);
    expect(isStepComplete('cooking', { ...ok, wantsBudget: true, weeklyBudgetEuros: 60 })).toBe(true);
  });

  it('optional steps are always completable', () => {
    expect(isStepComplete('training', base)).toBe(true);
    expect(isStepComplete('limitations', base)).toBe(true);
    expect(isStepComplete('restrictions', base)).toBe(true);
  });

  it('lifestyle requires the core rhythm answers', () => {
    expect(isStepComplete('lifestyle', { wakeUpTime: '07:00', bedTime: '23:00' })).toBe(false);
    expect(
      isStepComplete('lifestyle', {
        wakeUpTime: '07:00',
        bedTime: '23:00',
        sleepQuality: 'good',
        stressLevel: 'low',
        preferredTrainingTime: 'morning',
      }),
    ).toBe(true);
  });
});

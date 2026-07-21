import type { OnboardingAnswers } from '@/types';
import { buildStepSummary } from '@/utils/onboarding-summary';

describe('buildStepSummary', () => {
  it('maps catalog values to human labels', () => {
    const rows = buildStepSummary('goal', { primaryGoal: 'lose_fat', secondaryGoals: ['strength'] });
    expect(rows).toEqual(
      expect.arrayContaining([
        { label: 'Objetivo', value: 'Perder grasa' },
        { label: 'Objetivos secundarios', value: 'Ganar fuerza' },
      ]),
    );
  });

  it('skips empty values', () => {
    const rows = buildStepSummary('personal', { age: 28 });
    expect(rows).toEqual([{ label: 'Edad', value: '28 años' }]);
  });

  it('returns an empty list when nothing is filled', () => {
    expect(buildStepSummary('activity', {})).toEqual([]);
  });

  it('formats the budget and booleans', () => {
    const answers: OnboardingAnswers = {
      cookingTime: '15_30',
      cookingLevel: 'basic',
      peopleToCookFor: 2,
      wantsBudget: true,
      weeklyBudgetEuros: 60,
    };
    const rows = buildStepSummary('cooking', answers);
    expect(rows.find((r) => r.label === 'Presupuesto')?.value).toContain('60');
    expect(rows.find((r) => r.label === 'Personas')?.value).toBe('2');
  });
});

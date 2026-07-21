import type { OnboardingDraft } from '@/types';
import {
  applicableEquipment,
  createEmptyDraft,
  draftToProfile,
  hasAllergies,
  needsDietOther,
  needsTargetSport,
  needsTargetWeight,
  nextStepId,
  prevStepId,
  sleepHoursBetween,
  stepNumber,
  stepProgress,
  toggleInArray,
  TOTAL_DATA_STEPS,
} from '@/utils/onboarding';

describe('onboarding step navigation', () => {
  it('creates an empty draft at the first step', () => {
    const draft = createEmptyDraft('2026-07-21T00:00:00.000Z');
    expect(draft.currentStepId).toBe('name');
    expect(draft.answers).toEqual({});
    expect(draft.completedStepIds).toEqual([]);
    expect(draft.schemaVersion).toBeGreaterThanOrEqual(1);
  });

  it('walks forward and backward through the steps', () => {
    expect(nextStepId('name')).toBe('goal');
    expect(nextStepId('lifestyle')).toBe('review');
    expect(nextStepId('review')).toBeNull();
    expect(prevStepId('name')).toBeNull();
    expect(prevStepId('review')).toBe('lifestyle');
    expect(prevStepId('goal')).toBe('name');
  });

  it('reports step numbers and progress', () => {
    expect(stepNumber('name')).toBe(1);
    expect(stepNumber('review')).toBe(TOTAL_DATA_STEPS);
    expect(stepProgress('review')).toBe(1);
    expect(stepProgress('name')).toBeCloseTo(1 / TOTAL_DATA_STEPS);
  });
});

describe('toggleInArray', () => {
  it('adds and removes values immutably', () => {
    expect(toggleInArray(undefined, 'a')).toEqual(['a']);
    expect(toggleInArray(['a'], 'b')).toEqual(['a', 'b']);
    expect(toggleInArray(['a', 'b'], 'a')).toEqual(['b']);
  });
});

describe('adaptive helpers', () => {
  it('needsTargetWeight only for fat loss / muscle gain', () => {
    expect(needsTargetWeight({ primaryGoal: 'lose_fat' })).toBe(true);
    expect(needsTargetWeight({ primaryGoal: 'gain_muscle' })).toBe(true);
    expect(needsTargetWeight({ primaryGoal: 'maintain' })).toBe(false);
    expect(needsTargetWeight({})).toBe(false);
  });

  it('needsTargetSport only when preparing an event', () => {
    expect(needsTargetSport({ primaryGoal: 'prepare_event' })).toBe(true);
    expect(needsTargetSport({ primaryGoal: 'lose_fat' })).toBe(false);
  });

  it('needsDietOther only for the "other" diet', () => {
    expect(needsDietOther({ dietType: 'other' })).toBe(true);
    expect(needsDietOther({ dietType: 'vegan' })).toBe(false);
  });

  it('hasAllergies considers common and free-text allergies', () => {
    expect(hasAllergies({})).toBe(false);
    expect(hasAllergies({ allergies: [] })).toBe(false);
    expect(hasAllergies({ allergies: ['gluten'] })).toBe(true);
    expect(hasAllergies({ otherAllergies: 'kiwi' })).toBe(true);
    expect(hasAllergies({ otherAllergies: '   ' })).toBe(false);
  });

  it('applicableEquipment filters by chosen places', () => {
    expect(applicableEquipment([])).toEqual([]);
    expect(applicableEquipment(undefined)).toEqual([]);
    const gym = applicableEquipment(['gym']);
    expect(gym).toContain('machines');
    expect(gym).not.toContain('none');
    const outdoor = applicableEquipment(['outdoor']);
    expect(outdoor).toContain('none');
    expect(outdoor).not.toContain('machines');
  });
});

describe('sleepHoursBetween', () => {
  it('handles overnight wrap', () => {
    expect(sleepHoursBetween('23:00', '07:00')).toBe(8);
    expect(sleepHoursBetween('22:30', '06:30')).toBe(8);
  });

  it('returns null for missing/invalid times', () => {
    expect(sleepHoursBetween(undefined, '07:00')).toBeNull();
    expect(sleepHoursBetween('23:00', undefined)).toBeNull();
    expect(sleepHoursBetween('bad', '07:00')).toBeNull();
  });
});

describe('draftToProfile', () => {
  it('trims the name, carries createdAt and sets the disclaimer', () => {
    const draft: OnboardingDraft = {
      schemaVersion: 1,
      currentStepId: 'review',
      completedStepIds: [],
      answers: { name: '  Ana  ', primaryGoal: 'lose_fat', weightKg: 62 },
      createdAt: '2026-07-01T00:00:00.000Z',
      updatedAt: '2026-07-10T00:00:00.000Z',
    };
    const profile = draftToProfile(draft, true, '2026-07-21T00:00:00.000Z');
    expect(profile.name).toBe('Ana');
    expect(profile.acknowledgedDisclaimer).toBe(true);
    expect(profile.createdAt).toBe('2026-07-01T00:00:00.000Z');
    expect(profile.updatedAt).toBe('2026-07-21T00:00:00.000Z');
    expect(profile.answers.primaryGoal).toBe('lose_fat');
  });
});

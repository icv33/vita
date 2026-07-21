import type { OnboardingAnswers } from '@/types';

/** Contract every step content component follows. */
export type StepProps = {
  answers: OnboardingAnswers;
  update: (patch: Partial<OnboardingAnswers>) => void;
};

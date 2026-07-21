/**
 * Maps each data step id to its content component. The review step is handled
 * directly by the questionnaire host (it needs router + confirmation state).
 */

import type { ComponentType } from 'react';

import { ActivityStep } from './activity-step';
import { AvailabilityStep } from './availability-step';
import { CookingStep } from './cooking-step';
import { ExperienceStep } from './experience-step';
import { GoalStep } from './goal-step';
import { LifestyleStep } from './lifestyle-step';
import { LimitationsStep } from './limitations-step';
import { NameStep } from './name-step';
import { NutritionStep } from './nutrition-step';
import { PersonalStep } from './personal-step';
import { PlaceStep } from './place-step';
import { RestrictionsStep } from './restrictions-step';
import { TrainingStep } from './training-step';
import type { StepProps } from './types';

export type { StepProps } from './types';

export const STEP_COMPONENTS: Record<string, ComponentType<StepProps>> = {
  name: NameStep,
  goal: GoalStep,
  personal: PersonalStep,
  activity: ActivityStep,
  experience: ExperienceStep,
  availability: AvailabilityStep,
  place: PlaceStep,
  training: TrainingStep,
  limitations: LimitationsStep,
  nutrition: NutritionStep,
  restrictions: RestrictionsStep,
  cooking: CookingStep,
  lifestyle: LifestyleStep,
};

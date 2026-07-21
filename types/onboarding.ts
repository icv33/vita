/**
 * Onboarding domain: the questionnaire answers, the in-progress draft and the
 * final confirmed user profile.
 *
 * All value unions come from the option catalogs (`constants/catalogs`) so the
 * data model and the UI options can never drift. Answer fields are optional
 * because the questionnaire is filled progressively and some are adaptive.
 */

import type {
  ActivityType,
  Appliance,
  CookingLevel,
  CookingTime,
  DailyStepsRange,
  DietType,
  Equipment,
  MealsOutRange,
  NutritionPriority,
  Occupation,
  PreferredTrainingTime,
  PrimaryGoal,
  SecondaryGoal,
  SessionDuration,
  Sex,
  SleepQuality,
  StressLevel,
  TrainingLevel,
  TrainingPlace,
  TrainingType,
} from '@/constants/catalogs';
import type { TimeString, Weekday } from './common';

/**
 * Everything the questionnaire can capture. Every field is optional: the draft
 * holds a partial version while in flow, and adaptive questions may never apply.
 */
export type OnboardingAnswers = {
  // Identity
  name?: string;

  // Goal
  primaryGoal?: PrimaryGoal;
  secondaryGoals?: SecondaryGoal[];
  /** Free text, only when primaryGoal === 'prepare_event'. */
  targetSport?: string;

  // Personal
  age?: number;
  sex?: Sex;
  heightCm?: number;
  weightKg?: number;
  /** Only relevant for lose_fat / gain_muscle goals. */
  targetWeightKg?: number;

  // Daily activity
  occupation?: Occupation;
  activityType?: ActivityType;
  dailySteps?: DailyStepsRange;

  // Training
  trainingLevel?: TrainingLevel;
  trainingDaysPerWeek?: number;
  sessionDuration?: SessionDuration;
  trainingPlaces?: TrainingPlace[];
  equipment?: Equipment[];
  trainingTypes?: TrainingType[];
  currentSports?: string;
  dislikedExercises?: string;
  /** Free text; never interpreted as medical advice. */
  physicalLimitations?: string;

  // Nutrition
  mealsPerDay?: number;
  dietType?: DietType;
  /** Free text, only when dietType === 'other'. */
  dietTypeOther?: string;
  /** Common allergies/intolerances (highlighted as important for future phases). */
  allergies?: string[];
  /** Any additional allergies/intolerances as free text. */
  otherAllergies?: string;
  dislikedFoods?: string;
  favoriteFoods?: string;
  mealsOutPerWeek?: MealsOutRange;
  repeatMeals?: boolean;
  nutritionPriority?: NutritionPriority;

  // Cooking & budget
  cookingTime?: CookingTime;
  cookingLevel?: CookingLevel;
  peopleToCookFor?: number;
  /** Whether the user wants to declare a budget (gates budget + supermarket). */
  wantsBudget?: boolean;
  weeklyBudgetEuros?: number;
  supermarket?: string;
  appliances?: Appliance[];

  // Lifestyle & sleep
  wakeUpTime?: TimeString;
  bedTime?: TimeString;
  sleepQuality?: SleepQuality;
  stressLevel?: StressLevel;
  preferredTrainingTime?: PreferredTrainingTime;
  noTrainingDays?: Weekday[];
};

/** Logical groupings used by the review screen. */
export type OnboardingSection =
  | 'profile'
  | 'goal'
  | 'activity'
  | 'training'
  | 'nutrition'
  | 'lifestyle';

/**
 * The temporary questionnaire state, persisted so the flow can be resumed.
 * Separate from the confirmed `UserProfile`.
 */
export type OnboardingDraft = {
  schemaVersion: number;
  /** The step to resume on. */
  currentStepId: string;
  /** Steps the user has already advanced past (for progress / resume). */
  completedStepIds: string[];
  answers: OnboardingAnswers;
  createdAt: string;
  updatedAt: string;
};

/**
 * The confirmed profile, written only when the user finishes the review step
 * and accepts the disclaimer. Derived fields (e.g. calories, sleep hours) are
 * intentionally NOT stored — they are computed from these answers later.
 */
export type UserProfile = {
  schemaVersion: number;
  name: string;
  answers: OnboardingAnswers;
  /** The user accepted the "planning tool, not a medical service" notice. */
  acknowledgedDisclaimer: boolean;
  createdAt: string;
  updatedAt: string;
};

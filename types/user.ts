/**
 * User profile and the answers captured by the onboarding questionnaire.
 *
 * These model the "Cuestionario inicial inteligente" and "Datos personales"
 * screens from the product reference. Kept intentionally lightweight for the
 * base phase — the full questionnaire is built later.
 */

export type Goal =
  | 'lose_fat'
  | 'gain_muscle'
  | 'improve_performance'
  | 'maintain'
  | 'improve_habits';

export type Sex = 'male' | 'female' | 'other';

export type ActivityLevel = 'low' | 'moderate' | 'high';

export type TrainingLocation = 'gym' | 'home' | 'outdoor';

export type TrainingDaysPerWeek = '1-2' | '3-4' | '5-6' | 'daily';

export type MealsPerDay = '2-3' | '4-6';

export type CookingTime = 'little' | 'medium' | 'plenty';

/** Physical + demographic data. */
export type PersonalData = {
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
};

/** Training preferences. */
export type TrainingPreferences = {
  daysPerWeek: TrainingDaysPerWeek;
  location: TrainingLocation;
};

/** Nutrition preferences. */
export type NutritionPreferences = {
  mealsPerDay: MealsPerDay;
  cookingTime: CookingTime;
  allergiesOrIntolerances: string[];
  weeklyBudgetEuros?: number;
};

/** Everything gathered during onboarding. */
export type OnboardingAnswers = {
  goal: Goal;
  personal: PersonalData;
  training: TrainingPreferences;
  nutrition: NutritionPreferences;
  activityLevel: ActivityLevel;
};

/** The persisted user profile. `Partial` onboarding is allowed while in flow. */
export type UserProfile = {
  name?: string;
  onboarding: Partial<OnboardingAnswers>;
  createdAt: string;
  updatedAt: string;
};

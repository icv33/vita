/**
 * The weekly plan (screen 3) ties nutrition + training together per day, plus
 * the daily targets shown at the bottom of the plan.
 */

import type { ID, Weekday } from './common';
import type { Meal } from './nutrition';
import type { Workout } from './training';

/** Aggregate daily nutrition/activity targets. */
export type DailyTargets = {
  calories: number;
  proteinG: number;
  steps: number;
  waterL: number;
};

/** One day of the weekly plan. */
export type PlanDay = {
  weekday: Weekday;
  workouts: Workout[];
  meals: Meal[];
};

/** A full personalised weekly plan. */
export type WeeklyPlan = {
  id: ID;
  days: PlanDay[];
  targets: DailyTargets;
  generatedAt: string;
};

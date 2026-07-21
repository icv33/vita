/**
 * Training domain: exercises and workout sessions.
 * Models the "Modifica tu plan" / workout screens of the product reference.
 */

import type { ID, TimeString } from './common';

export type ExerciseIntensity = 'low' | 'medium' | 'high';

/** A single exercise within a workout. */
export type Exercise = {
  id: ID;
  name: string;
  intensity: ExerciseIntensity;
  sets: number;
  reps: string; // e.g. "8-10" or "45 s"
  loadKg?: number;
};

export type WorkoutFocus =
  | 'rest'
  | 'strength'
  | 'cardio'
  | 'upper_body'
  | 'lower_body'
  | 'full_body'
  | 'mobility';

/** A workout session scheduled in the plan. */
export type Workout = {
  id: ID;
  title: string;
  focus: WorkoutFocus;
  time: TimeString;
  durationMin: number;
  exercises: Exercise[];
};

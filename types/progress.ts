/**
 * Progress tracking domain (screen 7): weight, body composition and adherence.
 */

import type { ISODate } from './common';

/** A single measurement point over time. */
export type ProgressPoint = {
  date: ISODate;
  weightKg: number;
  muscleKg?: number;
  bodyFatPct?: number;
};

/** Weekly adherence / completion summary. */
export type ProgressSummary = {
  currentWeightKg: number;
  weightDeltaKg: number;
  workoutsCompleted: number;
  workoutsPlanned: number;
  nutritionAdherencePct: number;
  series: ProgressPoint[];
};

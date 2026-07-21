/**
 * Plan service — the seam between the UI and data sources.
 *
 * Right now it resolves local demo data behind an async API. When a backend is
 * added later, only this file changes; screens keep calling the same methods.
 * No real network, payments or external APIs in this phase (by design).
 */

import { demoProgress, demoShoppingList, demoWeeklyPlan } from '@/data';
import type { ProgressSummary, ShoppingList, WeeklyPlan } from '@/types';

/** Simulate async so callers are written for the eventual network layer. */
function resolve<T>(value: T, delayMs = 0): Promise<T> {
  return new Promise((res) => setTimeout(() => res(value), delayMs));
}

export const planService = {
  getWeeklyPlan(): Promise<WeeklyPlan> {
    return resolve(demoWeeklyPlan);
  },

  getProgressSummary(): Promise<ProgressSummary> {
    return resolve(demoProgress);
  },

  getShoppingList(): Promise<ShoppingList> {
    return resolve(demoShoppingList);
  },
};

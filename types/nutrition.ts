/**
 * Nutrition domain: meals, macros, food logging and the shopping list.
 * Models screens 4–6 of the product reference.
 */

import type { ID, TimeString } from './common';

export type MealType = 'breakfast' | 'lunch' | 'snack' | 'dinner';

/** Macro-nutrients in grams. */
export type Macros = {
  proteinG: number;
  carbsG: number;
  fatG: number;
};

/** A single meal in a plan. */
export type Meal = {
  id: ID;
  type: MealType;
  name: string;
  time: TimeString;
  calories: number;
  macros: Macros;
};

/** A meal logged by the user (e.g. via photo). */
export type LoggedMeal = {
  id: ID;
  name: string;
  calories: number;
  macros: Macros;
  /** Model confidence 0–1 when estimated from a photo. */
  confidence?: number;
  loggedAt: string;
};

export type ShoppingCategory =
  | 'fruits_vegetables'
  | 'dairy_eggs'
  | 'proteins'
  | 'pantry'
  | 'frozen'
  | 'other';

export type ShoppingItem = {
  id: ID;
  name: string;
  quantity: string;
  category: ShoppingCategory;
  estimatedPriceEuros?: number;
  checked: boolean;
};

export type ShoppingList = {
  items: ShoppingItem[];
  totalEstimatedEuros: number;
};

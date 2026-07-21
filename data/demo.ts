/**
 * Demo / seed data.
 *
 * Used to populate placeholder screens so navigation and the design system can
 * be reviewed with realistic content. This is NOT the real plan generator —
 * that arrives in a later phase. Values mirror the product reference image.
 */

import type {
  DailyTargets,
  ProgressSummary,
  ShoppingList,
  WeeklyPlan,
} from '@/types';

export const demoTargets: DailyTargets = {
  calories: 1850,
  proteinG: 120,
  steps: 8500,
  waterL: 2.2,
};

export const demoWeeklyPlan: WeeklyPlan = {
  id: 'demo-plan',
  generatedAt: '2026-07-21T08:00:00.000Z',
  targets: demoTargets,
  days: [
    {
      weekday: 'monday',
      workouts: [
        {
          id: 'w-mon',
          title: 'Fuerza · Tren superior',
          focus: 'upper_body',
          time: '08:00',
          durationMin: 50,
          exercises: [],
        },
      ],
      meals: [],
    },
    {
      weekday: 'tuesday',
      workouts: [
        {
          id: 'w-tue',
          title: 'Cardio HIIT',
          focus: 'cardio',
          time: '18:00',
          durationMin: 45,
          exercises: [],
        },
      ],
      meals: [],
    },
    { weekday: 'wednesday', workouts: [], meals: [] },
    { weekday: 'thursday', workouts: [], meals: [] },
    { weekday: 'friday', workouts: [], meals: [] },
    { weekday: 'saturday', workouts: [], meals: [] },
    { weekday: 'sunday', workouts: [], meals: [] },
  ],
};

export const demoProgress: ProgressSummary = {
  currentWeightKg: 62.0,
  weightDeltaKg: -2.5,
  workoutsCompleted: 12,
  workoutsPlanned: 16,
  nutritionAdherencePct: 85,
  series: [
    { date: '2026-06-23', weightKg: 64.5 },
    { date: '2026-06-30', weightKg: 63.8 },
    { date: '2026-07-07', weightKg: 63.1 },
    { date: '2026-07-14', weightKg: 62.6 },
    { date: '2026-07-21', weightKg: 62.0 },
  ],
};

export const demoShoppingList: ShoppingList = {
  totalEstimatedEuros: 67.35,
  items: [
    { id: 's1', name: 'Plátano', quantity: '12 ud', category: 'fruits_vegetables', checked: false },
    { id: 's2', name: 'Espinacas', quantity: '400 g', category: 'fruits_vegetables', checked: false },
    { id: 's3', name: 'Pechuga de pollo', quantity: '1,2 kg', category: 'proteins', checked: false },
    { id: 's4', name: 'Huevos', quantity: '12 ud', category: 'proteins', checked: true },
    { id: 's5', name: 'Yogur natural', quantity: '1 kg', category: 'dairy_eggs', checked: false },
    { id: 's6', name: 'Avena', quantity: '1 kg', category: 'pantry', checked: false },
  ],
};

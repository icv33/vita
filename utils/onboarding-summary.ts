/**
 * Pure builders that turn raw onboarding answers into human-readable summary
 * rows for the review screen. Values are mapped through the option catalogs so
 * labels stay consistent with the questions. No React — easy to unit test.
 */

import {
  ACTIVITY_TYPES,
  APPLIANCES,
  COMMON_ALLERGIES,
  COOKING_LEVELS,
  COOKING_TIMES,
  DAILY_STEPS,
  DIET_TYPES,
  EQUIPMENT,
  MEALS_OUT,
  NUTRITION_PRIORITIES,
  OCCUPATIONS,
  PREFERRED_TRAINING_TIMES,
  PRIMARY_GOALS,
  SECONDARY_GOALS,
  SESSION_DURATIONS,
  SEXES,
  SLEEP_QUALITIES,
  STRESS_LEVELS,
  TRAINING_LEVELS,
  TRAINING_PLACES,
  TRAINING_TYPES,
  type Option,
} from '@/constants';
import type { OnboardingAnswers, Weekday } from '@/types';
import { weekdayLabel } from './date';
import { formatEuros } from './format';
import { sleepHoursBetween } from './onboarding';

export type SummaryRow = { label: string; value: string };

const DASH = '—';

function labelOf<T extends string>(catalog: readonly Option<T>[], value: T | undefined): string | undefined {
  if (value == null) return undefined;
  return catalog.find((o) => o.value === value)?.label;
}

function labelsOf<T extends string>(catalog: readonly Option<T>[], values: T[] | undefined): string | undefined {
  if (!values || values.length === 0) return undefined;
  const labels = values
    .map((v) => catalog.find((o) => o.value === v)?.label)
    .filter((l): l is string => Boolean(l));
  return labels.length ? labels.join(', ') : undefined;
}

/** Build a row only when there's a value; otherwise skip it. */
function row(label: string, value: string | undefined): SummaryRow[] {
  return value ? [{ label, value }] : [];
}

/** Summary rows for a given data step. Empty when nothing is filled in. */
export function buildStepSummary(stepId: string, a: OnboardingAnswers): SummaryRow[] {
  switch (stepId) {
    case 'name':
      return row('Nombre', a.name?.trim());

    case 'goal':
      return [
        ...row('Objetivo', labelOf(PRIMARY_GOALS, a.primaryGoal)),
        ...row('Prueba / deporte', a.targetSport?.trim()),
        ...row('Objetivos secundarios', labelsOf(SECONDARY_GOALS, a.secondaryGoals)),
      ];

    case 'personal':
      return [
        ...row('Edad', a.age != null ? `${a.age} años` : undefined),
        ...row('Sexo', labelOf(SEXES, a.sex)),
        ...row('Altura', a.heightCm != null ? `${a.heightCm} cm` : undefined),
        ...row('Peso', a.weightKg != null ? `${a.weightKg} kg` : undefined),
        ...row('Peso objetivo', a.targetWeightKg != null ? `${a.targetWeightKg} kg` : undefined),
      ];

    case 'activity':
      return [
        ...row('Ocupación', labelOf(OCCUPATIONS, a.occupation)),
        ...row('Actividad', labelOf(ACTIVITY_TYPES, a.activityType)),
        ...row('Pasos diarios', labelOf(DAILY_STEPS, a.dailySteps)),
      ];

    case 'experience':
      return row('Nivel', labelOf(TRAINING_LEVELS, a.trainingLevel));

    case 'availability':
      return [
        ...row('Días por semana', a.trainingDaysPerWeek != null ? String(a.trainingDaysPerWeek) : undefined),
        ...row('Duración', labelOf(SESSION_DURATIONS, a.sessionDuration)),
      ];

    case 'place':
      return [
        ...row('Lugar', labelsOf(TRAINING_PLACES, a.trainingPlaces)),
        ...row('Material', labelsOf(EQUIPMENT, a.equipment)),
      ];

    case 'training':
      return [
        ...row('Tipos', labelsOf(TRAINING_TYPES, a.trainingTypes)),
        ...row('Deportes', a.currentSports?.trim()),
        ...row('No le gustan', a.dislikedExercises?.trim()),
      ];

    case 'limitations':
      return row('Limitaciones', a.physicalLimitations?.trim());

    case 'nutrition':
      return [
        ...row('Comidas al día', a.mealsPerDay != null ? String(a.mealsPerDay) : undefined),
        ...row('Alimentación', a.dietType === 'other' ? a.dietTypeOther?.trim() : labelOf(DIET_TYPES, a.dietType)),
      ];

    case 'restrictions': {
      const allergies = [labelsOf(COMMON_ALLERGIES, a.allergies), a.otherAllergies?.trim()]
        .filter(Boolean)
        .join(', ');
      return [
        ...row('Alergias', allergies || undefined),
        ...row('No le gustan', a.dislikedFoods?.trim()),
        ...row('Favoritos', a.favoriteFoods?.trim()),
        ...row('Come fuera', labelOf(MEALS_OUT, a.mealsOutPerWeek)),
        ...row('Repite platos', a.repeatMeals == null ? undefined : a.repeatMeals ? 'Sí' : 'No'),
        ...row('Prioriza', labelOf(NUTRITION_PRIORITIES, a.nutritionPriority)),
      ];
    }

    case 'cooking':
      return [
        ...row('Tiempo para cocinar', labelOf(COOKING_TIMES, a.cookingTime)),
        ...row('Nivel de cocina', labelOf(COOKING_LEVELS, a.cookingLevel)),
        ...row('Personas', a.peopleToCookFor != null ? String(a.peopleToCookFor) : undefined),
        ...row('Presupuesto', a.wantsBudget && a.weeklyBudgetEuros != null ? formatEuros(a.weeklyBudgetEuros) : undefined),
        ...row('Supermercado', a.wantsBudget ? a.supermarket?.trim() : undefined),
        ...row('Electrodomésticos', labelsOf(APPLIANCES, a.appliances)),
      ];

    case 'lifestyle': {
      const hours = sleepHoursBetween(a.bedTime, a.wakeUpTime);
      const noDays = (a.noTrainingDays ?? []).map((d: Weekday) => weekdayLabel(d)).join(', ');
      return [
        ...row('Despertar', a.wakeUpTime),
        ...row('Acostarse', a.bedTime),
        ...row('Sueño estimado', hours != null ? `≈ ${hours.toLocaleString('es-ES')} h` : undefined),
        ...row('Calidad', labelOf(SLEEP_QUALITIES, a.sleepQuality)),
        ...row('Estrés', labelOf(STRESS_LEVELS, a.stressLevel)),
        ...row('Prefiere entrenar', labelOf(PREFERRED_TRAINING_TIMES, a.preferredTrainingTime)),
        ...row('Días sin entrenar', noDays || undefined),
      ];
    }

    default:
      return [];
  }
}

/** Section titles for grouping the review cards. */
export const SECTION_TITLES: Record<string, string> = {
  profile: 'Perfil',
  goal: 'Objetivo',
  activity: 'Actividad',
  training: 'Entrenamiento',
  nutrition: 'Alimentación',
  lifestyle: 'Estilo de vida',
};

/** Concise titles for each step's review card. */
export const STEP_REVIEW_TITLES: Record<string, string> = {
  name: 'Nombre',
  goal: 'Objetivo',
  personal: 'Datos personales',
  activity: 'Actividad diaria',
  experience: 'Experiencia',
  availability: 'Disponibilidad',
  place: 'Lugar y material',
  training: 'Preferencias',
  limitations: 'Limitaciones',
  nutrition: 'Hábitos alimentarios',
  restrictions: 'Restricciones',
  cooking: 'Cocina y presupuesto',
  lifestyle: 'Rutina y descanso',
};

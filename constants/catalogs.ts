/**
 * Onboarding option catalogs — the single source of truth for every choice the
 * questionnaire offers.
 *
 * Each catalog is declared `as const` and the corresponding union type is
 * derived from it, so option values and TypeScript types never drift apart and
 * copy lives in exactly one place. UI reads labels/descriptions/icons from here.
 */

import type { IconName } from '@/theme';

/** A selectable option shown by Selector / ChipGroup. */
export type Option<T extends string> = {
  readonly value: T;
  readonly label: string;
  readonly description?: string;
  readonly icon?: IconName;
};

/** Helper to derive the value union from a catalog tuple. */
type ValueOf<C extends readonly Option<string>[]> = C[number]['value'];

// ── Goals ────────────────────────────────────────────────────────────────────

export const PRIMARY_GOALS = [
  { value: 'lose_fat', label: 'Perder grasa', description: 'Reducir grasa corporal', icon: 'flame' },
  { value: 'gain_muscle', label: 'Ganar masa muscular', description: 'Aumentar músculo', icon: 'fitness' },
  { value: 'improve_performance', label: 'Mejorar rendimiento', description: 'Más fuerza y resistencia', icon: 'speedometer' },
  { value: 'maintain', label: 'Mantenerme', description: 'Conservar mi estado actual', icon: 'infinite' },
  { value: 'improve_habits', label: 'Mejorar mis hábitos', description: 'Vida más saludable', icon: 'leaf' },
  { value: 'prepare_event', label: 'Preparar una prueba o deporte', description: 'Objetivo concreto', icon: 'trophy' },
] as const satisfies readonly Option<string>[];
export type PrimaryGoal = ValueOf<typeof PRIMARY_GOALS>;

export const SECONDARY_GOALS = [
  { value: 'strength', label: 'Ganar fuerza', icon: 'trophy' },
  { value: 'endurance', label: 'Aumentar resistencia', icon: 'pulse' },
  { value: 'mobility', label: 'Mejorar movilidad', icon: 'body' },
  { value: 'energy', label: 'Sentir más energía', icon: 'flash' },
  { value: 'nutrition', label: 'Mejorar alimentación', icon: 'nutrition' },
  { value: 'routine', label: 'Crear una rutina constante', icon: 'repeat' },
] as const satisfies readonly Option<string>[];
export type SecondaryGoal = ValueOf<typeof SECONDARY_GOALS>;

// ── Personal ─────────────────────────────────────────────────────────────────

export const SEXES = [
  { value: 'female', label: 'Mujer' },
  { value: 'male', label: 'Hombre' },
  { value: 'other', label: 'Otro' },
  { value: 'prefer_not', label: 'Prefiero no indicarlo' },
] as const satisfies readonly Option<string>[];
export type Sex = ValueOf<typeof SEXES>;

// ── Activity ─────────────────────────────────────────────────────────────────

export const OCCUPATIONS = [
  { value: 'work', label: 'Trabajo', icon: 'briefcase' },
  { value: 'university', label: 'Universidad', icon: 'school' },
  { value: 'school', label: 'Colegio', icon: 'book' },
  { value: 'work_study', label: 'Trabajo y estudios', icon: 'business' },
  { value: 'no_fixed', label: 'Sin horario fijo', icon: 'shuffle' },
  { value: 'other', label: 'Otro', icon: 'person' },
] as const satisfies readonly Option<string>[];
export type Occupation = ValueOf<typeof OCCUPATIONS>;

export const ACTIVITY_TYPES = [
  { value: 'sedentary', label: 'Principalmente sentado', description: 'Poco movimiento durante el día', icon: 'body' },
  { value: 'light', label: 'Ligeramente activo', description: 'Algo de movimiento', icon: 'walk' },
  { value: 'active', label: 'Activo', description: 'De pie o caminando a menudo', icon: 'walk' },
  { value: 'very_active', label: 'Muy activo', description: 'En movimiento casi todo el día', icon: 'bicycle' },
  { value: 'physical_job', label: 'Trabajo físico', description: 'Esfuerzo físico intenso', icon: 'hammer' },
] as const satisfies readonly Option<string>[];
export type ActivityType = ValueOf<typeof ACTIVITY_TYPES>;

export const DAILY_STEPS = [
  { value: 'lt_4k', label: 'Menos de 4.000' },
  { value: '4k_7k', label: '4.000 – 7.000' },
  { value: '7k_10k', label: '7.000 – 10.000' },
  { value: 'gt_10k', label: 'Más de 10.000' },
  { value: 'unknown', label: 'No lo sé' },
] as const satisfies readonly Option<string>[];
export type DailyStepsRange = ValueOf<typeof DAILY_STEPS>;

// ── Training ─────────────────────────────────────────────────────────────────

export const TRAINING_LEVELS = [
  { value: 'beginner', label: 'Principiante', description: 'Empiezo ahora o vuelvo tras tiempo', icon: 'leaf' },
  { value: 'intermediate', label: 'Intermedio', description: 'Entreno con cierta regularidad', icon: 'trendingUp' },
  { value: 'advanced', label: 'Avanzado', description: 'Entreno de forma constante', icon: 'flame' },
] as const satisfies readonly Option<string>[];
export type TrainingLevel = ValueOf<typeof TRAINING_LEVELS>;

export const SESSION_DURATIONS = [
  { value: '20_30', label: '20 – 30 minutos' },
  { value: '30_45', label: '30 – 45 minutos' },
  { value: '45_60', label: '45 – 60 minutos' },
  { value: '60_90', label: '60 – 90 minutos' },
] as const satisfies readonly Option<string>[];
export type SessionDuration = ValueOf<typeof SESSION_DURATIONS>;

export const TRAINING_PLACES = [
  { value: 'gym', label: 'Gimnasio', icon: 'trophy' },
  { value: 'home', label: 'Casa', icon: 'home' },
  { value: 'outdoor', label: 'Exterior', icon: 'sunny' },
] as const satisfies readonly Option<string>[];
export type TrainingPlace = ValueOf<typeof TRAINING_PLACES>;

export const EQUIPMENT = [
  { value: 'none', label: 'Ninguno', icon: 'body' },
  { value: 'dumbbells', label: 'Mancuernas', icon: 'fitness' },
  { value: 'bands', label: 'Bandas', icon: 'pulse' },
  { value: 'bench', label: 'Banco', icon: 'bed' },
  { value: 'barbell', label: 'Barra y discos', icon: 'barbell' },
  { value: 'machines', label: 'Máquinas', icon: 'construct' },
  { value: 'bike', label: 'Bicicleta', icon: 'bicycle' },
  { value: 'treadmill', label: 'Cinta', icon: 'walk' },
  { value: 'full', label: 'Material completo', icon: 'trophy' },
] as const satisfies readonly Option<string>[];
export type Equipment = ValueOf<typeof EQUIPMENT>;

/** Equipment available at each place — powers adaptive filtering. */
export const EQUIPMENT_BY_PLACE: Record<TrainingPlace, Equipment[]> = {
  gym: ['dumbbells', 'bands', 'bench', 'barbell', 'machines', 'bike', 'treadmill', 'full'],
  home: ['none', 'dumbbells', 'bands', 'bench', 'barbell', 'bike', 'treadmill'],
  outdoor: ['none', 'dumbbells', 'bands'],
};

export const TRAINING_TYPES = [
  { value: 'strength', label: 'Fuerza', icon: 'barbell' },
  { value: 'hypertrophy', label: 'Hipertrofia', icon: 'fitness' },
  { value: 'running', label: 'Carrera', icon: 'walk' },
  { value: 'cardio', label: 'Cardio', icon: 'heart' },
  { value: 'mobility', label: 'Movilidad', icon: 'body' },
  { value: 'hiit', label: 'HIIT', icon: 'flash' },
  { value: 'sports', label: 'Deportes', icon: 'football' },
  { value: 'functional', label: 'Funcional', icon: 'fitness' },
] as const satisfies readonly Option<string>[];
export type TrainingType = ValueOf<typeof TRAINING_TYPES>;

// ── Nutrition ────────────────────────────────────────────────────────────────

export const DIET_TYPES = [
  { value: 'none', label: 'Sin restricciones', icon: 'restaurantAlt' },
  { value: 'vegetarian', label: 'Vegetariana', icon: 'leaf' },
  { value: 'vegan', label: 'Vegana', icon: 'leaf' },
  { value: 'pescetarian', label: 'Pescetariana', icon: 'fish' },
  { value: 'halal', label: 'Halal', icon: 'moon' },
  { value: 'gluten_free', label: 'Sin gluten', icon: 'nutrition' },
  { value: 'other', label: 'Otra', icon: 'shuffle' },
] as const satisfies readonly Option<string>[];
export type DietType = ValueOf<typeof DIET_TYPES>;

export const MEALS_OUT = [
  { value: 'never', label: 'Casi nunca' },
  { value: 'few', label: '1 – 3 por semana' },
  { value: 'several', label: '4 – 6 por semana' },
  { value: 'daily', label: 'A diario' },
] as const satisfies readonly Option<string>[];
export type MealsOutRange = ValueOf<typeof MEALS_OUT>;

export const NUTRITION_PRIORITIES = [
  { value: 'economic', label: 'Económico', icon: 'cash' },
  { value: 'fast', label: 'Rápido', icon: 'flash' },
  { value: 'varied', label: 'Variado', icon: 'shuffle' },
  { value: 'balanced', label: 'Equilibrado', icon: 'nutrition' },
  { value: 'high_protein', label: 'Alto en proteína', icon: 'fitness' },
] as const satisfies readonly Option<string>[];
export type NutritionPriority = ValueOf<typeof NUTRITION_PRIORITIES>;

export const COOKING_TIMES = [
  { value: 'lt_15', label: 'Menos de 15 minutos' },
  { value: '15_30', label: '15 – 30 minutos' },
  { value: '30_60', label: '30 – 60 minutos' },
  { value: 'unlimited', label: 'Sin limitación' },
] as const satisfies readonly Option<string>[];
export type CookingTime = ValueOf<typeof COOKING_TIMES>;

export const COOKING_LEVELS = [
  { value: 'basic', label: 'Básico' },
  { value: 'medium', label: 'Medio' },
  { value: 'advanced', label: 'Avanzado' },
] as const satisfies readonly Option<string>[];
export type CookingLevel = ValueOf<typeof COOKING_LEVELS>;

export const APPLIANCES = [
  { value: 'oven', label: 'Horno', icon: 'flame' },
  { value: 'microwave', label: 'Microondas', icon: 'time' },
  { value: 'air_fryer', label: 'Air fryer', icon: 'fastFood' },
  { value: 'blender', label: 'Batidora', icon: 'nutrition' },
  { value: 'stove', label: 'Vitrocerámica', icon: 'flame' },
  { value: 'freezer', label: 'Congelador', icon: 'snow' },
] as const satisfies readonly Option<string>[];
export type Appliance = ValueOf<typeof APPLIANCES>;

// ── Lifestyle & sleep ────────────────────────────────────────────────────────

export const SLEEP_QUALITIES = [
  { value: 'bad', label: 'Mala', icon: 'sad' },
  { value: 'regular', label: 'Regular', icon: 'remove' },
  { value: 'good', label: 'Buena', icon: 'happy' },
  { value: 'very_good', label: 'Muy buena', icon: 'star' },
] as const satisfies readonly Option<string>[];
export type SleepQuality = ValueOf<typeof SLEEP_QUALITIES>;

export const STRESS_LEVELS = [
  { value: 'low', label: 'Bajo' },
  { value: 'medium', label: 'Medio' },
  { value: 'high', label: 'Alto' },
] as const satisfies readonly Option<string>[];
export type StressLevel = ValueOf<typeof STRESS_LEVELS>;

export const PREFERRED_TRAINING_TIMES = [
  { value: 'morning', label: 'Mañana', icon: 'sunny' },
  { value: 'midday', label: 'Mediodía', icon: 'partlySunny' },
  { value: 'afternoon', label: 'Tarde', icon: 'cloud' },
  { value: 'evening', label: 'Noche', icon: 'moon' },
  { value: 'any', label: 'Indiferente', icon: 'shuffle' },
] as const satisfies readonly Option<string>[];
export type PreferredTrainingTime = ValueOf<typeof PREFERRED_TRAINING_TIMES>;

/** Common food allergies/intolerances offered as quick chips (plus free text). */
export const COMMON_ALLERGIES = [
  { value: 'gluten', label: 'Gluten' },
  { value: 'lactose', label: 'Lactosa' },
  { value: 'nuts', label: 'Frutos secos' },
  { value: 'egg', label: 'Huevo' },
  { value: 'fish', label: 'Pescado' },
  { value: 'shellfish', label: 'Marisco' },
  { value: 'soy', label: 'Soja' },
] as const satisfies readonly Option<string>[];
export type CommonAllergy = ValueOf<typeof COMMON_ALLERGIES>;

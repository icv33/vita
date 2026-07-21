/**
 * Calendar constants: the visible day window, slot size, schema versions and
 * the activity category / location catalogs (single source of truth, with
 * derived unions matching the domain types).
 */

import type { IconName } from '@/theme';
import type { ActivityCategory, ActivityLocation } from '@/types';

// ── Time window & slots ──────────────────────────────────────────────────────

/** First visible minute of the day (07:00). */
export const CALENDAR_DAY_START_MIN = 7 * 60; // 420
/** Last visible minute of the day (23:00). */
export const CALENDAR_DAY_END_MIN = 23 * 60; // 1380
/** Slot granularity in minutes. */
export const CALENDAR_SLOT_MIN = 30;
/** Minimum block duration in minutes. */
export const CALENDAR_MIN_BLOCK_MIN = 30;

/** Number of visible minutes in the day window. */
export const CALENDAR_WINDOW_MIN = CALENDAR_DAY_END_MIN - CALENDAR_DAY_START_MIN;

// ── Schema versions (for migrations) ─────────────────────────────────────────

export const SCHEDULE_SCHEMA_VERSION = 1;
export const CALENDAR_META_SCHEMA_VERSION = 1;

// ── Categories ───────────────────────────────────────────────────────────────

export type CategoryMeta = {
  readonly value: ActivityCategory;
  readonly label: string;
  readonly icon: IconName;
  /** Strong accent color (icon, left bar, text). */
  readonly color: string;
  /** Soft translucent fill that reads on both light and dark themes. */
  readonly bg: string;
  readonly description: string;
};

export const ACTIVITY_CATEGORIES = [
  { value: 'work', label: 'Trabajo', icon: 'briefcase', color: '#2E5BFF', bg: 'rgba(46, 91, 255, 0.14)', description: 'Tu jornada laboral' },
  { value: 'university', label: 'Universidad', icon: 'school', color: '#7C5CFF', bg: 'rgba(124, 92, 255, 0.14)', description: 'Clases y estudio' },
  { value: 'school', label: 'Colegio', icon: 'book', color: '#12B5A5', bg: 'rgba(18, 181, 165, 0.15)', description: 'Horario escolar' },
  { value: 'class', label: 'Clases', icon: 'easel', color: '#4C6FFF', bg: 'rgba(76, 111, 255, 0.14)', description: 'Clases o academias' },
  { value: 'commute', label: 'Desplazamiento', icon: 'car', color: '#64748B', bg: 'rgba(100, 116, 139, 0.16)', description: 'Trayectos y viajes' },
  { value: 'meal', label: 'Comida', icon: 'meals', color: '#F5A524', bg: 'rgba(245, 165, 36, 0.16)', description: 'Comidas del día' },
  { value: 'training', label: 'Entrenamiento', icon: 'training', color: '#16A34A', bg: 'rgba(22, 163, 74, 0.15)', description: 'Sesiones de entreno' },
  { value: 'sleep', label: 'Sueño', icon: 'bed', color: '#5B6472', bg: 'rgba(91, 100, 114, 0.16)', description: 'Descanso nocturno' },
  { value: 'unavailable', label: 'No disponible', icon: 'ban', color: '#E5484D', bg: 'rgba(229, 72, 77, 0.13)', description: 'Tiempo bloqueado' },
  { value: 'other', label: 'Otro', icon: 'ellipsis', color: '#9AA1AD', bg: 'rgba(154, 161, 173, 0.18)', description: 'Cualquier otra cosa' },
] as const satisfies readonly CategoryMeta[];

const CATEGORY_BY_VALUE: Record<ActivityCategory, CategoryMeta> = ACTIVITY_CATEGORIES.reduce(
  (acc, c) => {
    acc[c.value] = c;
    return acc;
  },
  {} as Record<ActivityCategory, CategoryMeta>,
);

/** Look up a category's presentation metadata. */
export function categoryMeta(category: ActivityCategory): CategoryMeta {
  return CATEGORY_BY_VALUE[category] ?? CATEGORY_BY_VALUE.other;
}

// ── Locations ────────────────────────────────────────────────────────────────

export type LocationOption = {
  readonly value: ActivityLocation;
  readonly label: string;
  readonly icon: IconName;
};

export const ACTIVITY_LOCATIONS = [
  { value: 'home', label: 'Casa', icon: 'home' },
  { value: 'university', label: 'Universidad', icon: 'school' },
  { value: 'work', label: 'Trabajo', icon: 'briefcase' },
  { value: 'gym', label: 'Gimnasio', icon: 'barbell' },
  { value: 'outdoor', label: 'Exterior', icon: 'sunny' },
  { value: 'other', label: 'Otro', icon: 'location' },
] as const satisfies readonly LocationOption[];

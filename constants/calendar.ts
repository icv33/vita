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

/** v2 adds `source`/`readOnly` (integration-ready) to blocks. */
export const SCHEDULE_SCHEMA_VERSION = 2;
/** v2 adds `view`/`lastWeekOffset` to the calendar meta. */
export const CALENDAR_META_SCHEMA_VERSION = 2;

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
  { value: 'work', label: 'Trabajo', icon: 'briefcase', color: '#3B6FF6', bg: 'rgba(59, 111, 246, 0.13)', description: 'Tu jornada laboral' },
  { value: 'university', label: 'Universidad', icon: 'school', color: '#14B8A6', bg: 'rgba(20, 184, 166, 0.15)', description: 'Clases y estudio' },
  { value: 'school', label: 'Colegio', icon: 'book', color: '#0891B2', bg: 'rgba(8, 145, 178, 0.14)', description: 'Horario escolar' },
  { value: 'class', label: 'Clases', icon: 'easel', color: '#6366F1', bg: 'rgba(99, 102, 241, 0.14)', description: 'Clases o academias' },
  { value: 'commute', label: 'Desplazamiento', icon: 'car', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.16)', description: 'Trayectos y viajes' },
  { value: 'meal', label: 'Comida', icon: 'meals', color: '#22C55E', bg: 'rgba(34, 197, 94, 0.15)', description: 'Comidas del día' },
  { value: 'training', label: 'Entrenamiento', icon: 'training', color: '#0E9F6E', bg: 'rgba(14, 159, 110, 0.16)', description: 'Sesiones de entreno' },
  { value: 'sleep', label: 'Sueño', icon: 'bed', color: '#64748B', bg: 'rgba(100, 116, 139, 0.15)', description: 'Descanso nocturno' },
  { value: 'unavailable', label: 'No disponible', icon: 'ban', color: '#6B7280', bg: 'rgba(107, 114, 128, 0.16)', description: 'Tiempo bloqueado' },
  { value: 'other', label: 'Otro', icon: 'ellipsis', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.15)', description: 'Cualquier otra cosa' },
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

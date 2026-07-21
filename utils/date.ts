/**
 * Date / weekday helpers. Kept dependency-free (no date library) since needs
 * are simple and Expo Go startup stays lean.
 */

import { WEEKDAYS, type ISODate, type Weekday } from '@/types';

const WEEKDAY_LABELS_ES: Record<Weekday, string> = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo',
};

const WEEKDAY_SHORT_ES: Record<Weekday, string> = {
  monday: 'Lun',
  tuesday: 'Mar',
  wednesday: 'Mié',
  thursday: 'Jue',
  friday: 'Vie',
  saturday: 'Sáb',
  sunday: 'Dom',
};

export function weekdayLabel(day: Weekday): string {
  return WEEKDAY_LABELS_ES[day];
}

export function weekdayShort(day: Weekday): string {
  return WEEKDAY_SHORT_ES[day];
}

/**
 * The `Weekday` for a JS Date. `Date.getDay()` is Sunday=0; Vita is Monday-first.
 */
export function weekdayFromDate(date: Date): Weekday {
  const jsDay = date.getDay(); // 0=Sun .. 6=Sat
  const mondayFirstIndex = (jsDay + 6) % 7; // 0=Mon .. 6=Sun
  return WEEKDAYS[mondayFirstIndex];
}

/** Today's weekday. */
export function todayWeekday(now: Date = new Date()): Weekday {
  return weekdayFromDate(now);
}

/** Format a Date as an ISO date (YYYY-MM-DD), local time. */
export function toISODate(date: Date): ISODate {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

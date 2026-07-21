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

/** A new Date `days` after `date` (can be negative). */
export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/** The Monday (00:00) of the week containing `date`. */
export function startOfWeekMonday(date: Date = new Date()): Date {
  const jsDay = date.getDay(); // 0=Sun..6=Sat
  const diff = (jsDay + 6) % 7; // days since Monday
  const monday = addDays(date, -diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

const MONTHS_SHORT_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/** "21–27 jul" for the week starting at `monday`. */
export function weekRangeLabel(monday: Date): string {
  const sunday = addDays(monday, 6);
  const sameMonth = monday.getMonth() === sunday.getMonth();
  if (sameMonth) {
    return `${monday.getDate()}–${sunday.getDate()} ${MONTHS_SHORT_ES[sunday.getMonth()]}`;
  }
  return `${monday.getDate()} ${MONTHS_SHORT_ES[monday.getMonth()]} – ${sunday.getDate()} ${MONTHS_SHORT_ES[sunday.getMonth()]}`;
}

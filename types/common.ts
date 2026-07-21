/**
 * Shared primitive/domain-agnostic types used across Vita.
 */

/** ISO-8601 date string, e.g. "2026-07-21". */
export type ISODate = string;

/** 24h time string, e.g. "08:30". */
export type TimeString = string;

/** Days of the week, Monday-first (matches the weekly plan layout). */
export type Weekday =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export const WEEKDAYS: readonly Weekday[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

/** Unique identifier alias for readability. */
export type ID = string;

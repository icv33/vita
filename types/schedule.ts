/**
 * Schedule / calendar domain: the interactive weekly availability calendar.
 *
 * Times are stored as **minutes from midnight** (`startMinutes`/`endMinutes`)
 * rather than strings, so ordering, overlap and gap maths are simple integer
 * comparisons. Nothing derived (durations, free windows, etc.) is stored — it is
 * computed on demand from these blocks.
 */

import type { ID, Weekday } from './common';

/** What a time block represents. Stable identifiers used as storage values. */
export type ActivityCategory =
  | 'work'
  | 'university'
  | 'school'
  | 'class'
  | 'commute'
  | 'meal'
  | 'training'
  | 'sleep'
  | 'unavailable'
  | 'other';

/** Where the activity happens (optional). */
export type ActivityLocation = 'home' | 'university' | 'work' | 'gym' | 'outdoor' | 'other';

/** A single time block on one day of the week. */
export type ActivityBlock = {
  id: ID;
  dayOfWeek: Weekday;
  /** Minutes from midnight, e.g. 09:30 → 570. */
  startMinutes: number;
  /** Minutes from midnight; must be strictly greater than `startMinutes`. */
  endMinutes: number;
  category: ActivityCategory;
  title?: string;
  location?: ActivityLocation;
  notes?: string;
  /** Whether the block repeats every week (all blocks are weekly for now). */
  isRecurringWeekly: boolean;
  createdAt: string;
  updatedAt: string;
};

/** The user's whole weekly availability. */
export type WeekSchedule = {
  schemaVersion: number;
  /** Which weekday the week starts on (Monday for Vita). */
  weekStartsOn: Weekday;
  /** IANA timezone id captured at creation (informational for now). */
  timezone: string;
  blocks: ActivityBlock[];
  createdAt: string;
  updatedAt: string;
};

/** Calendar-specific settings/meta persisted separately from the schedule. */
export type CalendarMeta = {
  schemaVersion: number;
  /** Whether the first-run calendar intro has been dealt with. */
  setupCompleted: boolean;
  /** The last day the user was viewing (to restore selection). */
  lastSelectedDay?: Weekday;
};

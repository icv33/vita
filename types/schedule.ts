/**
 * Schedule / calendar domain: the interactive weekly calendar (screen 2) where
 * the user blocks time for work, study, training, meals, etc.
 */

import type { ID, ISODate, TimeString, Weekday } from './common';

export type ActivityKind =
  | 'work'
  | 'university'
  | 'training'
  | 'meal'
  | 'commute'
  | 'class'
  | 'free'
  | 'sleep';

/** A time block placed on the calendar. */
export type ActivityBlock = {
  id: ID;
  kind: ActivityKind;
  title: string;
  weekday: Weekday;
  start: TimeString;
  end: TimeString;
  location?: string;
};

/** A whole week of blocks, keyed by the week's Monday date. */
export type WeekSchedule = {
  weekStart: ISODate;
  blocks: ActivityBlock[];
};

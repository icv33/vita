/**
 * Shared geometry for the day timeline. One place to convert between minutes and
 * pixels so the grid, blocks and current-time indicator stay aligned.
 */

import { CALENDAR_DAY_START_MIN, CALENDAR_WINDOW_MIN } from '@/constants/calendar';

/** Left column width for hour labels. */
export const GUTTER_WIDTH = 54;
/** Height of one hour of the timeline. */
export const HOUR_HEIGHT = 72;
export const PX_PER_MIN = HOUR_HEIGHT / 60;
/** Height of one 30-minute slot. */
export const SLOT_HEIGHT = PX_PER_MIN * 30;
/** Total scrollable height of the timeline content. */
export const TIMELINE_HEIGHT = CALENDAR_WINDOW_MIN * PX_PER_MIN;

/** Y offset (px) for a given minute-of-day. */
export function minuteToY(minutes: number): number {
  return (minutes - CALENDAR_DAY_START_MIN) * PX_PER_MIN;
}

/** Minute-of-day for a given Y offset (px). */
export function yToMinute(y: number): number {
  return CALENDAR_DAY_START_MIN + y / PX_PER_MIN;
}

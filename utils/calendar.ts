/**
 * Pure calendar/availability logic. No React, no storage — integer maths over
 * "minutes from midnight", so it is deterministic and easy to unit test. These
 * functions power both the UI (busy/free, ordering) and the future planner
 * (free windows, most-available days).
 */

import {
  CALENDAR_DAY_END_MIN,
  CALENDAR_DAY_START_MIN,
  CALENDAR_SLOT_MIN,
  SCHEDULE_SCHEMA_VERSION,
} from '@/constants/calendar';
import { WEEKDAYS, type ActivityBlock, type ActivityCategory, type WeekSchedule, type Weekday } from '@/types';

export type Interval = { startMinutes: number; endMinutes: number };

/** A fresh, empty weekly schedule. */
export function createEmptySchedule(
  now: string = new Date().toISOString(),
  timezone = 'UTC',
): WeekSchedule {
  return {
    schemaVersion: SCHEDULE_SCHEMA_VERSION,
    weekStartsOn: 'monday',
    timezone,
    blocks: [],
    createdAt: now,
    updatedAt: now,
  };
}

// ── Time helpers ─────────────────────────────────────────────────────────────

/** 570 → "09:30". */
export function minutesToTime(minutes: number): string {
  const m = ((minutes % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}

/** "09:30" → 570, or null if malformed. */
export function timeToMinutes(time: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time);
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}

/** Round a minute value to the nearest slot boundary. */
export function snapToSlot(minutes: number, slot: number = CALENDAR_SLOT_MIN): number {
  return Math.round(minutes / slot) * slot;
}

/** Local clamp (the exported one lives in utils/format). */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** "1 h 30 min", "45 min", "2 h". */
export function formatDuration(minutes: number): string {
  if (minutes <= 0) return '0 min';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}

/** "07:30 – 09:00" */
export function formatRange(startMinutes: number, endMinutes: number): string {
  return `${minutesToTime(startMinutes)} – ${minutesToTime(endMinutes)}`;
}

// ── Ordering & overlap ───────────────────────────────────────────────────────

/** Blocks sorted by start, then end. Returns a new array. */
export function sortBlocks<T extends Interval>(blocks: readonly T[]): T[] {
  return [...blocks].sort((a, b) =>
    a.startMinutes === b.startMinutes ? a.endMinutes - b.endMinutes : a.startMinutes - b.startMinutes,
  );
}

/**
 * True when two intervals overlap. Touching edges (a.end === b.start) do NOT
 * count as an overlap, so consecutive blocks are allowed.
 */
export function overlaps(a: Interval, b: Interval): boolean {
  return a.startMinutes < b.endMinutes && b.startMinutes < a.endMinutes;
}

/** Any block in `others` overlapping `candidate` (optionally ignoring one id). */
export function findConflicts(
  candidate: Interval,
  others: readonly ActivityBlock[],
  ignoreId?: string,
): ActivityBlock[] {
  return others.filter((b) => b.id !== ignoreId && overlaps(candidate, b));
}

export function hasConflict(
  candidate: Interval,
  others: readonly ActivityBlock[],
  ignoreId?: string,
): boolean {
  return findConflicts(candidate, others, ignoreId).length > 0;
}

export function blockDuration(block: Interval): number {
  return block.endMinutes - block.startMinutes;
}

// ── Day queries ──────────────────────────────────────────────────────────────

export function blocksForDay(schedule: WeekSchedule | null, day: Weekday): ActivityBlock[] {
  if (!schedule) return [];
  return sortBlocks(schedule.blocks.filter((b) => b.dayOfWeek === day));
}

export function countBlocksForDay(schedule: WeekSchedule | null, day: Weekday): number {
  if (!schedule) return 0;
  return schedule.blocks.reduce((n, b) => (b.dayOfWeek === day ? n + 1 : n), 0);
}

/**
 * Merge overlapping/touching intervals into disjoint coverage, clamped to the
 * visible window. Input need not be sorted.
 */
export function mergeIntervals(
  blocks: readonly Interval[],
  windowStart: number = CALENDAR_DAY_START_MIN,
  windowEnd: number = CALENDAR_DAY_END_MIN,
): Interval[] {
  const clamped = blocks
    .map((b) => ({
      startMinutes: clamp(b.startMinutes, windowStart, windowEnd),
      endMinutes: clamp(b.endMinutes, windowStart, windowEnd),
    }))
    .filter((b) => b.endMinutes > b.startMinutes);
  const sorted = sortBlocks(clamped);
  const merged: Interval[] = [];
  for (const iv of sorted) {
    const last = merged[merged.length - 1];
    if (last && iv.startMinutes <= last.endMinutes) {
      last.endMinutes = Math.max(last.endMinutes, iv.endMinutes);
    } else {
      merged.push({ ...iv });
    }
  }
  return merged;
}

/** Busy minutes within the window (overlaps counted once). */
export function busyMinutes(
  blocks: readonly Interval[],
  windowStart: number = CALENDAR_DAY_START_MIN,
  windowEnd: number = CALENDAR_DAY_END_MIN,
): number {
  return mergeIntervals(blocks, windowStart, windowEnd).reduce(
    (sum, iv) => sum + (iv.endMinutes - iv.startMinutes),
    0,
  );
}

/** Free minutes within the window. */
export function freeMinutes(
  blocks: readonly Interval[],
  windowStart: number = CALENDAR_DAY_START_MIN,
  windowEnd: number = CALENDAR_DAY_END_MIN,
): number {
  return windowEnd - windowStart - busyMinutes(blocks, windowStart, windowEnd);
}

/** Free gaps (complement of busy coverage) within the window. */
export function freeGaps(
  blocks: readonly Interval[],
  windowStart: number = CALENDAR_DAY_START_MIN,
  windowEnd: number = CALENDAR_DAY_END_MIN,
): Interval[] {
  const merged = mergeIntervals(blocks, windowStart, windowEnd);
  const gaps: Interval[] = [];
  let cursor = windowStart;
  for (const iv of merged) {
    if (iv.startMinutes > cursor) {
      gaps.push({ startMinutes: cursor, endMinutes: iv.startMinutes });
    }
    cursor = Math.max(cursor, iv.endMinutes);
  }
  if (cursor < windowEnd) {
    gaps.push({ startMinutes: cursor, endMinutes: windowEnd });
  }
  return gaps;
}

/** Free gaps of at least `minDurationMin`. */
export function freeWindows(
  blocks: readonly Interval[],
  minDurationMin: number,
  windowStart: number = CALENDAR_DAY_START_MIN,
  windowEnd: number = CALENDAR_DAY_END_MIN,
): Interval[] {
  return freeGaps(blocks, windowStart, windowEnd).filter(
    (g) => g.endMinutes - g.startMinutes >= minDurationMin,
  );
}

/** The longest free gap, or null when the day is fully booked. */
export function longestFreeWindow(
  blocks: readonly Interval[],
  windowStart: number = CALENDAR_DAY_START_MIN,
  windowEnd: number = CALENDAR_DAY_END_MIN,
): Interval | null {
  const gaps = freeGaps(blocks, windowStart, windowEnd);
  if (gaps.length === 0) return null;
  return gaps.reduce((best, g) =>
    g.endMinutes - g.startMinutes > best.endMinutes - best.startMinutes ? g : best,
  );
}

/** Next block starting at or after `fromMinutes` (blocks assumed same day). */
export function nextBlock(blocks: readonly ActivityBlock[], fromMinutes: number): ActivityBlock | null {
  const sorted = sortBlocks(blocks);
  return sorted.find((b) => b.startMinutes >= fromMinutes) ?? null;
}

/** Hour marks (07:00, 08:00 … 23:00) for the visible timeline window. */
export function timelineHours(
  windowStart: number = CALENDAR_DAY_START_MIN,
  windowEnd: number = CALENDAR_DAY_END_MIN,
): number[] {
  const hours: number[] = [];
  for (let m = windowStart; m <= windowEnd; m += 60) hours.push(m);
  return hours;
}

/**
 * Suggested start time for a new block: the first free gap of the day, or a
 * sensible fallback (mid-morning) when the day is fully booked. Drives both the
 * FAB and the per-day "add" affordance so they share one decision.
 */
export function suggestedNewBlockStart(blocks: readonly Interval[]): number {
  const gap = freeGaps(blocks)[0];
  return gap ? gap.startMinutes : CALENDAR_DAY_START_MIN + 120;
}

/** Whether the compact "day is free" hint should be shown over the timeline. */
export function shouldShowEmptyDayHint(blockCount: number, dismissed: boolean): boolean {
  return blockCount === 0 && !dismissed;
}

// ── Week-level queries ───────────────────────────────────────────────────────

/** Minutes booked per category across the whole week (overlaps counted raw). */
export function categoryDistribution(
  schedule: WeekSchedule | null,
): Partial<Record<ActivityCategory, number>> {
  const dist: Partial<Record<ActivityCategory, number>> = {};
  if (!schedule) return dist;
  for (const b of schedule.blocks) {
    const dur = clamp(b.endMinutes, CALENDAR_DAY_START_MIN, CALENDAR_DAY_END_MIN) -
      clamp(b.startMinutes, CALENDAR_DAY_START_MIN, CALENDAR_DAY_END_MIN);
    if (dur > 0) dist[b.category] = (dist[b.category] ?? 0) + dur;
  }
  return dist;
}

/** Weekdays sorted by free time (most available first). */
export function daysByAvailability(schedule: WeekSchedule | null): { day: Weekday; freeMinutes: number }[] {
  return WEEKDAYS.map((day) => ({
    day,
    freeMinutes: freeMinutes(blocksForDay(schedule, day)),
  })).sort((a, b) => b.freeMinutes - a.freeMinutes);
}

/** Whether Vita may edit/delete this block (external blocks are read-only). */
export function isBlockEditable(block: ActivityBlock): boolean {
  return !block.readOnly;
}

export type DaySummary = {
  blocks: ActivityBlock[];
  count: number;
  busyMinutes: number;
  freeMinutes: number;
  longestFree: Interval | null;
};

/** Everything the UI needs for a single day — computed once, no duplication. */
export function daySummary(schedule: WeekSchedule | null, day: Weekday): DaySummary {
  const blocks = blocksForDay(schedule, day);
  return {
    blocks,
    count: blocks.length,
    busyMinutes: busyMinutes(blocks),
    freeMinutes: freeMinutes(blocks),
    longestFree: longestFreeWindow(blocks),
  };
}

export type WeekTotals = {
  totalBusyMinutes: number;
  totalFreeMinutes: number;
  totalBlocks: number;
  mostAvailableDay: Weekday | null;
};

/** Week-level totals for the summary card. */
export function weekTotals(schedule: WeekSchedule | null): WeekTotals {
  let totalBusy = 0;
  let totalFree = 0;
  let totalBlocks = 0;
  for (const day of WEEKDAYS) {
    const dayBlocks = blocksForDay(schedule, day);
    totalBusy += busyMinutes(dayBlocks);
    totalFree += freeMinutes(dayBlocks);
    totalBlocks += dayBlocks.length;
  }
  const ranked = daysByAvailability(schedule);
  return {
    totalBusyMinutes: totalBusy,
    totalFreeMinutes: totalFree,
    totalBlocks,
    mostAvailableDay: ranked.length > 0 ? ranked[0].day : null,
  };
}

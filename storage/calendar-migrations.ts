/**
 * Pure schema migrations for the calendar. Kept separate and side-effect-free so
 * they can be unit tested and evolved as the schema version grows.
 */

import { CALENDAR_META_SCHEMA_VERSION, SCHEDULE_SCHEMA_VERSION } from '@/constants/calendar';
import type { ActivityBlock, ActivityCategory, CalendarMeta, WeekSchedule, Weekday } from '@/types';
import { timeToMinutes } from '@/utils/calendar';

/** Legacy (v0) block shape: HH:mm strings + `kind`. */
type LegacyBlock = {
  id?: string;
  kind?: string;
  title?: string;
  weekday?: Weekday;
  start?: string;
  end?: string;
  location?: string;
};

const LEGACY_KIND_TO_CATEGORY: Record<string, ActivityCategory> = {
  work: 'work',
  university: 'university',
  class: 'class',
  commute: 'commute',
  meal: 'meal',
  training: 'training',
  sleep: 'sleep',
};

function nowISO(): string {
  return new Date().toISOString();
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Bring any persisted schedule up to the current schema version, or return null
 * when there's nothing usable. Handles the current version (pass-through), the
 * legacy v0 shape (`weekStart` + HH:mm `start`/`end` + `kind`) and unknown data.
 */
export function migrateSchedule(raw: unknown): WeekSchedule | null {
  if (!isObject(raw)) return null;

  // Current version: trust the shape.
  if (raw.schemaVersion === SCHEDULE_SCHEMA_VERSION && Array.isArray(raw.blocks)) {
    return raw as unknown as WeekSchedule;
  }

  // Legacy v0: { weekStart, blocks: [{ kind, weekday, start, end }] }.
  if (Array.isArray(raw.blocks) && ('weekStart' in raw || raw.schemaVersion == null)) {
    const ts = nowISO();
    const blocks: ActivityBlock[] = (raw.blocks as LegacyBlock[])
      .map((b): ActivityBlock | null => {
        const start = b.start ? timeToMinutes(b.start) : null;
        const end = b.end ? timeToMinutes(b.end) : null;
        if (start == null || end == null || end <= start || !b.weekday) return null;
        const category = (b.kind && LEGACY_KIND_TO_CATEGORY[b.kind]) || 'other';
        return {
          id: b.id ?? `mig_${Math.random().toString(36).slice(2, 9)}`,
          dayOfWeek: b.weekday,
          startMinutes: start,
          endMinutes: end,
          category,
          title: b.title,
          isRecurringWeekly: true,
          createdAt: ts,
          updatedAt: ts,
        };
      })
      .filter((b): b is ActivityBlock => b !== null);

    return {
      schemaVersion: SCHEDULE_SCHEMA_VERSION,
      weekStartsOn: 'monday',
      timezone: 'UTC',
      blocks,
      createdAt: ts,
      updatedAt: ts,
    };
  }

  return null;
}

/** Bring persisted calendar meta up to the current version (defaults on miss). */
export function migrateMeta(raw: unknown): CalendarMeta {
  const base: CalendarMeta = { schemaVersion: CALENDAR_META_SCHEMA_VERSION, setupCompleted: false };
  if (!isObject(raw)) return base;
  return {
    schemaVersion: CALENDAR_META_SCHEMA_VERSION,
    setupCompleted: raw.setupCompleted === true,
    lastSelectedDay: (raw.lastSelectedDay as Weekday | undefined) ?? undefined,
  };
}

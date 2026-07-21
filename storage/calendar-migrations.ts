/**
 * Pure schema migrations for the calendar. Kept separate and side-effect-free so
 * they can be unit tested and evolved as the schema version grows.
 *
 * Schedule versions:
 *  - v0 (legacy): `{ weekStart, blocks:[{ kind, weekday, start:"HH:mm", end }] }`.
 *  - v1: minutes-from-midnight blocks with `category` (no `source`).
 *  - v2 (current): adds `source`/`readOnly` (integration-ready).
 */

import { CALENDAR_META_SCHEMA_VERSION, SCHEDULE_SCHEMA_VERSION } from '@/constants/calendar';
import type {
  ActivityBlock,
  ActivityCategory,
  CalendarMeta,
  CalendarView,
  WeekSchedule,
  Weekday,
} from '@/types';
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
 * Normalise a stored block to the current shape: every block gets a `source`
 * (defaulting to `vita`, since anything created before v2 was made in Vita) and
 * a boolean `isRecurringWeekly`. Vita blocks are editable (no `readOnly`).
 */
function normaliseBlock(raw: Record<string, unknown>): ActivityBlock | null {
  const block = raw as Partial<ActivityBlock>;
  if (
    typeof block.startMinutes !== 'number' ||
    typeof block.endMinutes !== 'number' ||
    block.endMinutes <= block.startMinutes ||
    !block.dayOfWeek ||
    !block.category
  ) {
    return null;
  }
  const ts = nowISO();
  return {
    id: block.id ?? `mig_${Math.random().toString(36).slice(2, 9)}`,
    dayOfWeek: block.dayOfWeek,
    startMinutes: block.startMinutes,
    endMinutes: block.endMinutes,
    category: block.category,
    title: block.title,
    location: block.location,
    notes: block.notes,
    isRecurringWeekly: block.isRecurringWeekly ?? true,
    source: block.source ?? 'vita',
    readOnly: block.readOnly,
    externalEventId: block.externalEventId,
    externalCalendarId: block.externalCalendarId,
    lastSyncedAt: block.lastSyncedAt,
    createdAt: block.createdAt ?? ts,
    updatedAt: block.updatedAt ?? ts,
  };
}

/**
 * Bring any persisted schedule up to the current schema version, or return null
 * when there's nothing usable.
 */
export function migrateSchedule(raw: unknown): WeekSchedule | null {
  if (!isObject(raw)) return null;

  // v1 / v2: blocks already use minutes + category. Normalise (adds `source`).
  if (Array.isArray(raw.blocks) && typeof raw.schemaVersion === 'number') {
    const blocks = (raw.blocks as Record<string, unknown>[])
      .map(normaliseBlock)
      .filter((b): b is ActivityBlock => b !== null);
    return {
      schemaVersion: SCHEDULE_SCHEMA_VERSION,
      weekStartsOn: (raw.weekStartsOn as Weekday) ?? 'monday',
      timezone: (raw.timezone as string) ?? 'UTC',
      blocks,
      createdAt: (raw.createdAt as string) ?? nowISO(),
      updatedAt: nowISO(),
    };
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
          source: 'vita',
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

const CALENDAR_VIEWS: CalendarView[] = ['day', 'week'];

/** Bring persisted calendar meta up to the current version (defaults on miss). */
export function migrateMeta(raw: unknown): CalendarMeta {
  const base: CalendarMeta = {
    schemaVersion: CALENDAR_META_SCHEMA_VERSION,
    setupCompleted: false,
    view: 'day',
    lastWeekOffset: 0,
  };
  if (!isObject(raw)) return base;
  const view = raw.view as CalendarView | undefined;
  const offset = raw.lastWeekOffset;
  return {
    schemaVersion: CALENDAR_META_SCHEMA_VERSION,
    setupCompleted: raw.setupCompleted === true,
    view: view && CALENDAR_VIEWS.includes(view) ? view : 'day',
    lastSelectedDay: (raw.lastSelectedDay as Weekday | undefined) ?? undefined,
    lastWeekOffset: typeof offset === 'number' ? offset : 0,
  };
}

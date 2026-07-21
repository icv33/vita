/**
 * Calendar store (Zustand).
 *
 * Owns the weekly availability schedule, the calendar meta (setup flag + view
 * preferences) and the current selection (day + week offset + day/week view).
 * Mutations happen on discrete user actions — never per keystroke — so each one
 * updates memory and persists immediately (awaited), keeping writes controlled
 * and race-free. All time maths lives in `utils/calendar`; validation in
 * `validation/calendar`. External (read-only) blocks are never edited/deleted.
 */

import { create } from 'zustand';

import { CALENDAR_META_SCHEMA_VERSION } from '@/constants/calendar';
import { calendarStorage } from '@/storage';
import type {
  ActivityBlock,
  ActivityCategory,
  ActivityLocation,
  CalendarMeta,
  CalendarView,
  WeekSchedule,
  Weekday,
} from '@/types';
import { blocksForDay, createEmptySchedule, hasConflict } from '@/utils/calendar';
import { todayWeekday } from '@/utils/date';
import { createId } from '@/utils/id';

const nowISO = () => new Date().toISOString();

function guessTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

const DEFAULT_META: CalendarMeta = {
  schemaVersion: CALENDAR_META_SCHEMA_VERSION,
  setupCompleted: false,
  view: 'day',
  lastWeekOffset: 0,
};

export type NewBlockInput = {
  dayOfWeek: Weekday;
  startMinutes: number;
  endMinutes: number;
  category: ActivityCategory;
  title?: string;
  location?: ActivityLocation;
  notes?: string;
  isRecurringWeekly?: boolean;
};

export type BlockPatch = Partial<Omit<ActivityBlock, 'id' | 'createdAt' | 'source'>>;

/** Result of a copy operation so the UI can report conflicts. */
export type CopyReport = { copied: number; skipped: number };

export type CalendarState = {
  schedule: WeekSchedule | null;
  meta: CalendarMeta;
  selectedDay: Weekday;
  /** Displayed week relative to the current one (0 = this week). */
  weekOffset: number;
  /** Active mobile view. */
  view: CalendarView;
  isHydrated: boolean;

  hydrate: () => Promise<void>;
  ensureSchedule: () => Promise<WeekSchedule>;
  completeSetup: () => Promise<void>;

  // View preferences (persisted in meta).
  setSelectedDay: (day: Weekday) => void;
  setWeekOffset: (offset: number) => void;
  setView: (view: CalendarView) => void;
  /** Jump to the current week + today, keeping the active view. */
  goToToday: () => void;

  addBlock: (input: NewBlockInput) => Promise<ActivityBlock>;
  updateBlock: (id: string, patch: BlockPatch) => Promise<void>;
  removeBlock: (id: string) => Promise<void>;
  moveBlock: (id: string, newStartMinutes: number) => Promise<void>;

  copyBlockToDay: (id: string, targetDay: Weekday) => Promise<CopyReport>;
  copyDayToDays: (sourceDay: Weekday, targetDays: Weekday[]) => Promise<CopyReport>;
  clearDay: (day: Weekday) => Promise<void>;
  resetWeek: () => Promise<void>;

  /** Reset only the visual preferences (view/day/week), keeping the schedule. */
  resetVisualPreferences: () => Promise<void>;
  resetCalendar: () => Promise<void>;
};

async function persistSchedule(schedule: WeekSchedule): Promise<void> {
  await calendarStorage.setSchedule(schedule);
}

/** Return a new schedule with `blocks`, bumping `updatedAt`. */
function withBlocks(schedule: WeekSchedule, blocks: ActivityBlock[]): WeekSchedule {
  return { ...schedule, blocks, updatedAt: nowISO() };
}

export const useCalendarStore = create<CalendarState>((set, get) => {
  /** Merge into meta (memory + storage). Used by every preference setter. */
  const patchMeta = (partial: Partial<CalendarMeta>) => {
    const meta = { ...get().meta, ...partial };
    set({ meta });
    void calendarStorage.setMeta(meta);
  };

  /** Look up a block; returns null if missing or read-only (external). */
  const editableBlock = (id: string): ActivityBlock | null => {
    const block = get().schedule?.blocks.find((b) => b.id === id);
    if (!block || block.readOnly) return null;
    return block;
  };

  return {
    schedule: null,
    meta: DEFAULT_META,
    selectedDay: 'monday',
    weekOffset: 0,
    view: 'day',
    isHydrated: false,

    hydrate: async () => {
      const [schedule, meta] = await Promise.all([
        calendarStorage.getSchedule(),
        calendarStorage.getMeta(),
      ]);
      set({
        schedule,
        meta,
        selectedDay: meta.lastSelectedDay ?? todayWeekday(),
        weekOffset: meta.lastWeekOffset,
        view: meta.view,
        isHydrated: true,
      });
    },

    ensureSchedule: async () => {
      const existing = get().schedule;
      if (existing) return existing;
      const schedule = createEmptySchedule(nowISO(), guessTimezone());
      set({ schedule });
      await persistSchedule(schedule);
      return schedule;
    },

    completeSetup: async () => {
      patchMeta({ setupCompleted: true });
    },

    setSelectedDay: (day) => {
      set({ selectedDay: day });
      patchMeta({ lastSelectedDay: day });
    },

    setWeekOffset: (offset) => {
      set({ weekOffset: offset });
      patchMeta({ lastWeekOffset: offset });
    },

    setView: (view) => {
      set({ view });
      patchMeta({ view });
    },

    goToToday: () => {
      const day = todayWeekday();
      set({ selectedDay: day, weekOffset: 0 });
      patchMeta({ lastSelectedDay: day, lastWeekOffset: 0 });
    },

    addBlock: async (input) => {
      const schedule = get().schedule ?? (await get().ensureSchedule());
      const ts = nowISO();
      const block: ActivityBlock = {
        id: createId('blk'),
        dayOfWeek: input.dayOfWeek,
        startMinutes: input.startMinutes,
        endMinutes: input.endMinutes,
        category: input.category,
        title: input.title?.trim() || undefined,
        location: input.location,
        notes: input.notes?.trim() || undefined,
        isRecurringWeekly: input.isRecurringWeekly ?? true,
        source: 'vita',
        createdAt: ts,
        updatedAt: ts,
      };
      const updated = withBlocks(schedule, [...schedule.blocks, block]);
      set({ schedule: updated });
      await persistSchedule(updated);
      return block;
    },

    updateBlock: async (id, patch) => {
      const schedule = get().schedule;
      // Ignore edits to missing or read-only (external) blocks.
      if (!schedule || !editableBlock(id)) return;
      const blocks = schedule.blocks.map((b) =>
        b.id === id
          ? {
              ...b,
              ...patch,
              title: patch.title !== undefined ? patch.title?.trim() || undefined : b.title,
              notes: patch.notes !== undefined ? patch.notes?.trim() || undefined : b.notes,
              updatedAt: nowISO(),
            }
          : b,
      );
      const updated = withBlocks(schedule, blocks);
      set({ schedule: updated });
      await persistSchedule(updated);
    },

    removeBlock: async (id) => {
      const schedule = get().schedule;
      if (!schedule || !editableBlock(id)) return;
      const updated = withBlocks(schedule, schedule.blocks.filter((b) => b.id !== id));
      set({ schedule: updated });
      await persistSchedule(updated);
    },

    moveBlock: async (id, newStartMinutes) => {
      const schedule = get().schedule;
      if (!schedule || !editableBlock(id)) return;
      const blocks = schedule.blocks.map((b) => {
        if (b.id !== id) return b;
        const duration = b.endMinutes - b.startMinutes;
        return { ...b, startMinutes: newStartMinutes, endMinutes: newStartMinutes + duration, updatedAt: nowISO() };
      });
      const updated = withBlocks(schedule, blocks);
      set({ schedule: updated });
      await persistSchedule(updated);
    },

    copyBlockToDay: async (id, targetDay) => {
      const schedule = get().schedule;
      if (!schedule) return { copied: 0, skipped: 0 };
      const source = schedule.blocks.find((b) => b.id === id);
      if (!source) return { copied: 0, skipped: 0 };
      const targetBlocks = blocksForDay(schedule, targetDay);
      if (hasConflict(source, targetBlocks)) return { copied: 0, skipped: 1 };
      const ts = nowISO();
      const copy: ActivityBlock = {
        ...source,
        id: createId('blk'),
        dayOfWeek: targetDay,
        source: 'vita',
        readOnly: undefined,
        externalEventId: undefined,
        externalCalendarId: undefined,
        createdAt: ts,
        updatedAt: ts,
      };
      const updated = withBlocks(schedule, [...schedule.blocks, copy]);
      set({ schedule: updated });
      await persistSchedule(updated);
      return { copied: 1, skipped: 0 };
    },

    copyDayToDays: async (sourceDay, targetDays) => {
      const schedule = get().schedule;
      if (!schedule) return { copied: 0, skipped: 0 };
      const source = blocksForDay(schedule, sourceDay);
      const working = [...schedule.blocks];
      let copied = 0;
      let skipped = 0;
      const ts = nowISO();
      for (const targetDay of targetDays) {
        if (targetDay === sourceDay) continue;
        for (const block of source) {
          const existing = working.filter((b) => b.dayOfWeek === targetDay);
          if (hasConflict(block, existing)) {
            skipped += 1;
            continue;
          }
          working.push({
            ...block,
            id: createId('blk'),
            dayOfWeek: targetDay,
            source: 'vita',
            readOnly: undefined,
            externalEventId: undefined,
            externalCalendarId: undefined,
            createdAt: ts,
            updatedAt: ts,
          });
          copied += 1;
        }
      }
      if (copied > 0) {
        const updated = withBlocks(schedule, working);
        set({ schedule: updated });
        await persistSchedule(updated);
      }
      return { copied, skipped };
    },

    clearDay: async (day) => {
      const schedule = get().schedule;
      if (!schedule) return;
      // Keep read-only (external) blocks; only Vita blocks are cleared.
      const updated = withBlocks(
        schedule,
        schedule.blocks.filter((b) => b.dayOfWeek !== day || b.readOnly),
      );
      set({ schedule: updated });
      await persistSchedule(updated);
    },

    resetWeek: async () => {
      const schedule = get().schedule;
      if (!schedule) return;
      // Keep read-only (external) blocks; only Vita blocks are removed.
      const updated = withBlocks(schedule, schedule.blocks.filter((b) => b.readOnly));
      set({ schedule: updated });
      await persistSchedule(updated);
    },

    resetVisualPreferences: async () => {
      const day = todayWeekday();
      set({ view: 'day', weekOffset: 0, selectedDay: day });
      const meta: CalendarMeta = {
        ...get().meta,
        view: 'day',
        lastWeekOffset: 0,
        lastSelectedDay: day,
      };
      set({ meta });
      await calendarStorage.setMeta(meta);
    },

    resetCalendar: async () => {
      await calendarStorage.reset();
      set({
        schedule: null,
        meta: DEFAULT_META,
        selectedDay: todayWeekday(),
        weekOffset: 0,
        view: 'day',
        isHydrated: true,
      });
    },
  };
});

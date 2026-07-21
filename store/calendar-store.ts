/**
 * Calendar store (Zustand).
 *
 * Owns the weekly availability schedule, the calendar meta and the selected day.
 * Mutations happen on discrete user actions (add/edit/delete/copy) — never per
 * keystroke — so each one updates memory and persists immediately (awaited),
 * keeping writes controlled and race-free. The UI only reads/calls the store;
 * all time maths lives in `utils/calendar` and validation in `validation/calendar`.
 */

import { create } from 'zustand';

import { SCHEDULE_SCHEMA_VERSION } from '@/constants/calendar';
import { calendarStorage } from '@/storage';
import type {
  ActivityBlock,
  ActivityCategory,
  ActivityLocation,
  CalendarMeta,
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

const DEFAULT_META: CalendarMeta = { schemaVersion: SCHEDULE_SCHEMA_VERSION, setupCompleted: false };

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

export type BlockPatch = Partial<Omit<ActivityBlock, 'id' | 'createdAt'>>;

/** Result of a copy operation so the UI can report conflicts. */
export type CopyReport = { copied: number; skipped: number };

export type CalendarState = {
  schedule: WeekSchedule | null;
  meta: CalendarMeta;
  selectedDay: Weekday;
  isHydrated: boolean;

  hydrate: () => Promise<void>;
  ensureSchedule: () => Promise<WeekSchedule>;
  setSelectedDay: (day: Weekday) => void;
  completeSetup: () => Promise<void>;

  addBlock: (input: NewBlockInput) => Promise<ActivityBlock>;
  updateBlock: (id: string, patch: BlockPatch) => Promise<void>;
  removeBlock: (id: string) => Promise<void>;
  moveBlock: (id: string, newStartMinutes: number) => Promise<void>;

  copyBlockToDay: (id: string, targetDay: Weekday) => Promise<CopyReport>;
  copyDayToDays: (sourceDay: Weekday, targetDays: Weekday[]) => Promise<CopyReport>;
  clearDay: (day: Weekday) => Promise<void>;
  resetWeek: () => Promise<void>;

  resetCalendar: () => Promise<void>;
};

async function persistSchedule(schedule: WeekSchedule): Promise<void> {
  await calendarStorage.setSchedule(schedule);
}

/** Return a new schedule with `blocks`, bumping `updatedAt`. */
function withBlocks(schedule: WeekSchedule, blocks: ActivityBlock[]): WeekSchedule {
  return { ...schedule, blocks, updatedAt: nowISO() };
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  schedule: null,
  meta: DEFAULT_META,
  selectedDay: 'monday',
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

  setSelectedDay: (day) => {
    const meta = { ...get().meta, lastSelectedDay: day };
    set({ selectedDay: day, meta });
    void calendarStorage.setMeta(meta);
  },

  completeSetup: async () => {
    const meta = { ...get().meta, setupCompleted: true };
    set({ meta });
    await calendarStorage.setMeta(meta);
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
    if (!schedule) return;
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
    if (!schedule) return;
    const updated = withBlocks(schedule, schedule.blocks.filter((b) => b.id !== id));
    set({ schedule: updated });
    await persistSchedule(updated);
  },

  moveBlock: async (id, newStartMinutes) => {
    const schedule = get().schedule;
    if (!schedule) return;
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
    const copy: ActivityBlock = { ...source, id: createId('blk'), dayOfWeek: targetDay, createdAt: ts, updatedAt: ts };
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
        working.push({ ...block, id: createId('blk'), dayOfWeek: targetDay, createdAt: ts, updatedAt: ts });
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
    const updated = withBlocks(schedule, schedule.blocks.filter((b) => b.dayOfWeek !== day));
    set({ schedule: updated });
    await persistSchedule(updated);
  },

  resetWeek: async () => {
    const schedule = get().schedule;
    if (!schedule) return;
    const updated = withBlocks(schedule, []);
    set({ schedule: updated });
    await persistSchedule(updated);
  },

  resetCalendar: async () => {
    await calendarStorage.reset();
    set({ schedule: null, meta: DEFAULT_META, selectedDay: todayWeekday(), isHydrated: true });
  },
}));

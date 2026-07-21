/**
 * Persistence for the weekly calendar: the schedule (blocks) and the calendar
 * meta (setup flag, last selected day), each behind a schema migration.
 */

import { STORAGE_KEYS } from '@/constants';
import type { CalendarMeta, WeekSchedule } from '@/types';
import { migrateMeta, migrateSchedule } from './calendar-migrations';
import { storage } from './storage';

export const calendarStorage = {
  /** The saved schedule (migrated), or null if none. */
  async getSchedule(): Promise<WeekSchedule | null> {
    const raw = await storage.getItem<unknown>(STORAGE_KEYS.calendarSchedule, null);
    return migrateSchedule(raw);
  },

  async setSchedule(schedule: WeekSchedule): Promise<boolean> {
    return storage.setItem(STORAGE_KEYS.calendarSchedule, schedule);
  },

  async clearSchedule(): Promise<boolean> {
    return storage.removeItem(STORAGE_KEYS.calendarSchedule);
  },

  /** Calendar meta (migrated; always resolves to a valid object). */
  async getMeta(): Promise<CalendarMeta> {
    const raw = await storage.getItem<unknown>(STORAGE_KEYS.calendarMeta, null);
    return migrateMeta(raw);
  },

  async setMeta(meta: CalendarMeta): Promise<boolean> {
    return storage.setItem(STORAGE_KEYS.calendarMeta, meta);
  },

  async clearMeta(): Promise<boolean> {
    return storage.removeItem(STORAGE_KEYS.calendarMeta);
  },

  /** Remove all calendar data (schedule + meta). */
  async reset(): Promise<boolean> {
    return storage.multiRemove([STORAGE_KEYS.calendarSchedule, STORAGE_KEYS.calendarMeta]);
  },
};

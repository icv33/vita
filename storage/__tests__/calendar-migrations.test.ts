import { CALENDAR_META_SCHEMA_VERSION, SCHEDULE_SCHEMA_VERSION } from '@/constants/calendar';
import { migrateMeta, migrateSchedule } from '@/storage';

describe('migrateSchedule', () => {
  it('returns null for junk', () => {
    expect(migrateSchedule(null)).toBeNull();
    expect(migrateSchedule(42)).toBeNull();
    expect(migrateSchedule({})).toBeNull();
  });

  it('normalises a versioned schedule to the current version', () => {
    const current = {
      schemaVersion: SCHEDULE_SCHEMA_VERSION,
      weekStartsOn: 'monday',
      timezone: 'UTC',
      blocks: [],
      createdAt: 't',
      updatedAt: 't',
    };
    const migrated = migrateSchedule(current);
    expect(migrated?.schemaVersion).toBe(SCHEDULE_SCHEMA_VERSION);
    expect(migrated?.blocks).toEqual([]);
  });

  it('migrates v1 blocks (no source) by adding source: vita', () => {
    const v1 = {
      schemaVersion: 1,
      weekStartsOn: 'monday',
      timezone: 'UTC',
      blocks: [
        {
          id: 'a',
          dayOfWeek: 'monday',
          startMinutes: 540,
          endMinutes: 1020,
          category: 'work',
          isRecurringWeekly: true,
          createdAt: 't',
          updatedAt: 't',
        },
      ],
      createdAt: 't',
      updatedAt: 't',
    };
    const migrated = migrateSchedule(v1);
    expect(migrated?.schemaVersion).toBe(SCHEDULE_SCHEMA_VERSION);
    expect(migrated?.blocks[0].source).toBe('vita');
    expect(migrated?.blocks[0].readOnly).toBeUndefined();
  });

  it('preserves an existing external read-only block', () => {
    const v2 = {
      schemaVersion: SCHEDULE_SCHEMA_VERSION,
      weekStartsOn: 'monday',
      timezone: 'UTC',
      blocks: [
        {
          id: 'ext',
          dayOfWeek: 'monday',
          startMinutes: 600,
          endMinutes: 660,
          category: 'other',
          isRecurringWeekly: true,
          source: 'google',
          readOnly: true,
          createdAt: 't',
          updatedAt: 't',
        },
      ],
      createdAt: 't',
      updatedAt: 't',
    };
    const migrated = migrateSchedule(v2);
    expect(migrated?.blocks[0].source).toBe('google');
    expect(migrated?.blocks[0].readOnly).toBe(true);
  });

  it('migrates a legacy v0 schedule (HH:mm strings + kind)', () => {
    const legacy = {
      weekStart: '2026-07-20',
      blocks: [
        { id: 'a', kind: 'work', weekday: 'monday', start: '09:00', end: '17:00', title: 'Oficina' },
        { id: 'b', kind: 'training', weekday: 'tuesday', start: '18:00', end: '19:00' },
        { id: 'c', kind: 'free', weekday: 'wednesday', start: 'bad', end: '19:00' }, // dropped
      ],
    };
    const migrated = migrateSchedule(legacy);
    expect(migrated).not.toBeNull();
    expect(migrated!.schemaVersion).toBe(SCHEDULE_SCHEMA_VERSION);
    expect(migrated!.blocks).toHaveLength(2);
    const [work, training] = migrated!.blocks;
    expect(work.category).toBe('work');
    expect(work.startMinutes).toBe(540);
    expect(work.endMinutes).toBe(1020);
    expect(work.source).toBe('vita');
    expect(training.category).toBe('training');
  });
});

describe('migrateMeta', () => {
  it('defaults on missing data', () => {
    expect(migrateMeta(null)).toEqual({
      schemaVersion: CALENDAR_META_SCHEMA_VERSION,
      setupCompleted: false,
      view: 'day',
      lastWeekOffset: 0,
    });
  });

  it('preserves setupCompleted, view, day and week offset', () => {
    const meta = migrateMeta({ setupCompleted: true, lastSelectedDay: 'friday', view: 'week', lastWeekOffset: -1 });
    expect(meta.setupCompleted).toBe(true);
    expect(meta.lastSelectedDay).toBe('friday');
    expect(meta.view).toBe('week');
    expect(meta.lastWeekOffset).toBe(-1);
  });

  it('falls back to the day view for an invalid view', () => {
    expect(migrateMeta({ view: 'nonsense' }).view).toBe('day');
  });
});

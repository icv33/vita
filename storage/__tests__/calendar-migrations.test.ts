import { SCHEDULE_SCHEMA_VERSION } from '@/constants/calendar';
import { migrateMeta, migrateSchedule } from '@/storage';

describe('migrateSchedule', () => {
  it('returns null for junk', () => {
    expect(migrateSchedule(null)).toBeNull();
    expect(migrateSchedule(42)).toBeNull();
    expect(migrateSchedule({})).toBeNull();
  });

  it('passes through a current-version schedule', () => {
    const current = {
      schemaVersion: SCHEDULE_SCHEMA_VERSION,
      weekStartsOn: 'monday',
      timezone: 'UTC',
      blocks: [],
      createdAt: 't',
      updatedAt: 't',
    };
    expect(migrateSchedule(current)).toBe(current);
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
    expect(training.category).toBe('training');
  });
});

describe('migrateMeta', () => {
  it('defaults on missing data', () => {
    expect(migrateMeta(null)).toEqual({ schemaVersion: expect.any(Number), setupCompleted: false });
  });

  it('preserves setupCompleted and lastSelectedDay', () => {
    const meta = migrateMeta({ setupCompleted: true, lastSelectedDay: 'friday' });
    expect(meta.setupCompleted).toBe(true);
    expect(meta.lastSelectedDay).toBe('friday');
  });
});

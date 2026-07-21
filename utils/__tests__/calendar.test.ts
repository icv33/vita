import type { ActivityBlock } from '@/types';
import {
  busyMinutes,
  categoryDistribution,
  createEmptySchedule,
  daySummary,
  daysByAvailability,
  formatDuration,
  freeGaps,
  freeMinutes,
  freeWindows,
  isBlockEditable,
  longestFreeWindow,
  mergeIntervals,
  minutesToTime,
  overlaps,
  sortBlocks,
  timeToMinutes,
  weekTotals,
} from '@/utils/calendar';

const H = (h: number, m = 0) => h * 60 + m;

function block(day: ActivityBlock['dayOfWeek'], start: number, end: number, category: ActivityBlock['category'] = 'work'): ActivityBlock {
  return {
    id: `${day}-${start}-${end}`,
    dayOfWeek: day,
    startMinutes: start,
    endMinutes: end,
    category,
    isRecurringWeekly: true,
    source: 'vita',
    createdAt: '',
    updatedAt: '',
  };
}

describe('time helpers', () => {
  it('converts minutes to time and back', () => {
    expect(minutesToTime(570)).toBe('09:30');
    expect(timeToMinutes('09:30')).toBe(570);
    expect(timeToMinutes('bad')).toBeNull();
  });

  it('formats durations', () => {
    expect(formatDuration(45)).toBe('45 min');
    expect(formatDuration(60)).toBe('1 h');
    expect(formatDuration(90)).toBe('1 h 30 min');
  });
});

describe('overlap and ordering', () => {
  it('detects overlaps but allows consecutive (touching) blocks', () => {
    expect(overlaps({ startMinutes: H(9), endMinutes: H(10) }, { startMinutes: H(9, 30), endMinutes: H(11) })).toBe(true);
    // Touching edges are NOT an overlap.
    expect(overlaps({ startMinutes: H(9), endMinutes: H(10) }, { startMinutes: H(10), endMinutes: H(11) })).toBe(false);
  });

  it('sorts blocks by start then end', () => {
    const sorted = sortBlocks([block('monday', H(12), H(13)), block('monday', H(9), H(10)), block('monday', H(9), H(9, 30))]);
    expect(sorted.map((b) => b.startMinutes)).toEqual([H(9), H(9), H(12)]);
    expect(sorted[0].endMinutes).toBe(H(9, 30));
  });
});

describe('busy / free / gaps', () => {
  const day = [block('monday', H(9), H(12)), block('monday', H(13), H(14))];

  it('merges overlapping intervals when counting busy time', () => {
    const overlapping = [block('monday', H(9), H(11)), block('monday', H(10), H(12))];
    expect(busyMinutes(overlapping)).toBe(180); // 09:00–12:00 counted once
  });

  it('computes free minutes within the 07:00–23:00 window', () => {
    // Window = 16h = 960 min. Busy = 3h + 1h = 4h = 240. Free = 720.
    expect(busyMinutes(day)).toBe(240);
    expect(freeMinutes(day)).toBe(720);
  });

  it('computes free gaps', () => {
    const gaps = freeGaps(day);
    expect(gaps).toEqual([
      { startMinutes: H(7), endMinutes: H(9) },
      { startMinutes: H(12), endMinutes: H(13) },
      { startMinutes: H(14), endMinutes: H(23) },
    ]);
  });

  it('filters free windows by minimum duration', () => {
    const windows = freeWindows(day, 120);
    expect(windows.map((w) => [w.startMinutes, w.endMinutes])).toEqual([
      [H(7), H(9)],
      [H(14), H(23)],
    ]);
  });

  it('finds the longest free window', () => {
    expect(longestFreeWindow(day)).toEqual({ startMinutes: H(14), endMinutes: H(23) });
    expect(longestFreeWindow([block('monday', H(7), H(23))])).toBeNull();
  });

  it('mergeIntervals clamps to the window', () => {
    expect(mergeIntervals([block('monday', H(6), H(8))])).toEqual([{ startMinutes: H(7), endMinutes: H(8) }]);
  });
});

describe('week-level queries', () => {
  it('computes category distribution', () => {
    const schedule = createEmptySchedule('t', 'UTC');
    schedule.blocks = [block('monday', H(9), H(11), 'work'), block('tuesday', H(18), H(19), 'training')];
    const dist = categoryDistribution(schedule);
    expect(dist.work).toBe(120);
    expect(dist.training).toBe(60);
  });

  it('ranks days by availability', () => {
    const schedule = createEmptySchedule('t', 'UTC');
    schedule.blocks = [block('monday', H(7), H(22)), block('tuesday', H(9), H(10))];
    const ranked = daysByAvailability(schedule);
    // Monday is almost fully booked, so it should rank last.
    expect(ranked[ranked.length - 1].day).toBe('monday');
    expect(ranked[0].freeMinutes).toBeGreaterThan(ranked[ranked.length - 1].freeMinutes);
  });
});

describe('daySummary and weekTotals', () => {
  it('daySummary aggregates blocks, busy/free and the longest free window', () => {
    const schedule = createEmptySchedule('t', 'UTC');
    schedule.blocks = [block('monday', H(9), H(12)), block('monday', H(13), H(14)), block('tuesday', H(9), H(10))];
    const mon = daySummary(schedule, 'monday');
    expect(mon.count).toBe(2);
    expect(mon.busyMinutes).toBe(240);
    expect(mon.freeMinutes).toBe(720);
    expect(mon.longestFree).toEqual({ startMinutes: H(14), endMinutes: H(23) });
    expect(daySummary(schedule, 'wednesday').count).toBe(0);
  });

  it('weekTotals sums the week and finds the most-available day', () => {
    const schedule = createEmptySchedule('t', 'UTC');
    schedule.blocks = [block('monday', H(7), H(22)), block('tuesday', H(9), H(10))];
    const totals = weekTotals(schedule);
    expect(totals.totalBlocks).toBe(2);
    expect(totals.totalBusyMinutes).toBe(900 + 60);
    // Monday is the busiest, so it is never the most available.
    expect(totals.mostAvailableDay).not.toBe('monday');
  });
});

describe('isBlockEditable', () => {
  it('is true for Vita blocks and false for read-only ones', () => {
    expect(isBlockEditable(block('monday', H(9), H(10)))).toBe(true);
    expect(isBlockEditable({ ...block('monday', H(9), H(10)), source: 'google', readOnly: true })).toBe(false);
  });
});

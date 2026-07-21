import { toISODate, weekdayFromDate, weekdayLabel, weekdayShort } from '@/utils/date';

describe('date utils', () => {
  it('maps JS dates to a Monday-first weekday', () => {
    // 2026-07-20 is a Monday.
    expect(weekdayFromDate(new Date(2026, 6, 20))).toBe('monday');
    // 2026-07-19 is a Sunday.
    expect(weekdayFromDate(new Date(2026, 6, 19))).toBe('sunday');
  });

  it('returns Spanish weekday labels', () => {
    expect(weekdayLabel('wednesday')).toBe('Miércoles');
    expect(weekdayShort('saturday')).toBe('Sáb');
  });

  it('formats a date as YYYY-MM-DD with zero padding', () => {
    expect(toISODate(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});

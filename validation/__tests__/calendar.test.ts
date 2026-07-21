import type { ActivityBlock } from '@/types';
import { validateBlock } from '@/validation';

const H = (h: number, m = 0) => h * 60 + m;

function block(id: string, start: number, end: number): ActivityBlock {
  return {
    id,
    dayOfWeek: 'monday',
    startMinutes: start,
    endMinutes: end,
    category: 'work',
    isRecurringWeekly: true,
    createdAt: '',
    updatedAt: '',
  };
}

describe('validateBlock', () => {
  it('accepts a valid block', () => {
    expect(validateBlock({ startMinutes: H(9), endMinutes: H(10) }).valid).toBe(true);
  });

  it('rejects start >= end', () => {
    const r = validateBlock({ startMinutes: H(10), endMinutes: H(10) });
    expect(r.valid).toBe(false);
    if (!r.valid) expect(r.code).toBe('order');
  });

  it('enforces the minimum duration', () => {
    const r = validateBlock({ startMinutes: H(9), endMinutes: H(9, 15) });
    expect(r.valid).toBe(false);
    if (!r.valid) expect(r.code).toBe('min_duration');
  });

  it('enforces the 07:00 lower bound', () => {
    const r = validateBlock({ startMinutes: H(6, 30), endMinutes: H(8) });
    expect(r.valid).toBe(false);
    if (!r.valid) expect(r.code).toBe('before_start');
  });

  it('enforces the 23:00 upper bound', () => {
    const r = validateBlock({ startMinutes: H(22), endMinutes: H(23, 30) });
    expect(r.valid).toBe(false);
    if (!r.valid) expect(r.code).toBe('after_end');
  });

  it('detects conflicts but allows consecutive blocks', () => {
    const existing = [block('a', H(9), H(10))];
    const conflict = validateBlock({ startMinutes: H(9, 30), endMinutes: H(11) }, existing);
    expect(conflict.valid).toBe(false);
    if (!conflict.valid) expect(conflict.code).toBe('conflict');

    // Touching is fine.
    expect(validateBlock({ startMinutes: H(10), endMinutes: H(11) }, existing).valid).toBe(true);
  });

  it('ignores the block being edited when checking conflicts', () => {
    const existing = [block('a', H(9), H(10))];
    expect(validateBlock({ startMinutes: H(9), endMinutes: H(10, 30) }, existing, 'a').valid).toBe(true);
  });
});

import { clamp, formatCalories, formatGrams, formatSignedKg, toPercent } from '@/utils/format';

describe('format utils', () => {
  it('formats calories with a kcal suffix', () => {
    expect(formatCalories(1850)).toContain('kcal');
    expect(formatCalories(1850.4)).toContain('1');
  });

  it('formats grams as whole numbers', () => {
    expect(formatGrams(119.6)).toBe('120 g');
  });

  it('adds a plus sign for positive weight deltas only', () => {
    expect(formatSignedKg(1.2).startsWith('+')).toBe(true);
    expect(formatSignedKg(-2.5).startsWith('+')).toBe(false);
    expect(formatSignedKg(-2.5).startsWith('-')).toBe(true);
  });

  it('clamps values into range', () => {
    expect(clamp(5, 0, 1)).toBe(1);
    expect(clamp(-3, 0, 1)).toBe(0);
    expect(clamp(0.4, 0, 1)).toBe(0.4);
  });

  it('converts a ratio to a clamped percentage', () => {
    expect(toPercent(0.855)).toBe(86);
    expect(toPercent(1.5)).toBe(100);
    expect(toPercent(-0.2)).toBe(0);
  });
});

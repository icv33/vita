import {
  firstError,
  isNumberInRange,
  validateAge,
  validateHeightCm,
  validateRequiredText,
  validateWeightKg,
} from '@/validation';

describe('validators', () => {
  it('isNumberInRange rejects non-numbers and out-of-range values', () => {
    expect(isNumberInRange(50, 0, 100)).toBe(true);
    expect(isNumberInRange('50', 0, 100)).toBe(false);
    expect(isNumberInRange(NaN, 0, 100)).toBe(false);
    expect(isNumberInRange(150, 0, 100)).toBe(false);
  });

  it('validateAge accepts realistic ages', () => {
    expect(validateAge(28).valid).toBe(true);
    expect(validateAge(5).valid).toBe(false);
    expect(validateAge(120).valid).toBe(false);
  });

  it('validateHeightCm and validateWeightKg enforce ranges', () => {
    expect(validateHeightCm(168).valid).toBe(true);
    expect(validateHeightCm(50).valid).toBe(false);
    expect(validateWeightKg(62).valid).toBe(true);
    expect(validateWeightKg(500).valid).toBe(false);
  });

  it('validateRequiredText rejects empty/whitespace', () => {
    expect(validateRequiredText('hola').valid).toBe(true);
    expect(validateRequiredText('   ').valid).toBe(false);
    expect(validateRequiredText('').valid).toBe(false);
  });

  it('firstError returns the first failing result', () => {
    const result = firstError(validateAge(28), validateWeightKg(999), validateHeightCm(168));
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.message).toMatch(/peso/i);
    }
  });

  it('firstError returns valid when all pass', () => {
    expect(firstError(validateAge(28), validateWeightKg(62)).valid).toBe(true);
  });
});

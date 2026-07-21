/**
 * Pure, framework-agnostic validators.
 *
 * Each returns a `ValidationResult` so screens can show inline field errors
 * without embedding rules in components. Extend as the questionnaire grows.
 */

export type ValidationResult = { valid: true } | { valid: false; message: string };

export const valid: ValidationResult = { valid: true };
export const invalid = (message: string): ValidationResult => ({ valid: false, message });

/** True when `n` is a finite number within [min, max]. */
export function isNumberInRange(n: unknown, min: number, max: number): boolean {
  return typeof n === 'number' && Number.isFinite(n) && n >= min && n <= max;
}

export function validateAge(age: unknown): ValidationResult {
  if (!isNumberInRange(age, 12, 100)) {
    return invalid('Introduce una edad entre 12 y 100 años.');
  }
  return valid;
}

export function validateHeightCm(height: unknown): ValidationResult {
  if (!isNumberInRange(height, 100, 250)) {
    return invalid('Introduce una altura entre 100 y 250 cm.');
  }
  return valid;
}

export function validateWeightKg(weight: unknown): ValidationResult {
  if (!isNumberInRange(weight, 30, 300)) {
    return invalid('Introduce un peso entre 30 y 300 kg.');
  }
  return valid;
}

/** Requires a non-empty, non-whitespace string. */
export function validateRequiredText(value: unknown): ValidationResult {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return invalid('Este campo es obligatorio.');
  }
  return valid;
}

/** Name/nickname: required, trimmed, 2–30 characters. */
export function validateName(value: unknown): ValidationResult {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return invalid('Introduce tu nombre.');
  }
  const trimmed = value.trim();
  if (trimmed.length < 2) return invalid('El nombre es demasiado corto.');
  if (trimmed.length > 30) return invalid('El nombre es demasiado largo (máx. 30).');
  return valid;
}

/** Weekly food budget in euros: positive and within a sensible range. */
export function validateBudget(value: unknown): ValidationResult {
  if (!isNumberInRange(value, 1, 1000)) {
    return invalid('Introduce un presupuesto entre 1 y 1000 €.');
  }
  return valid;
}

/** Runs several validators and returns the first failure, else `valid`. */
export function firstError(...results: ValidationResult[]): ValidationResult {
  return results.find((r) => !r.valid) ?? valid;
}

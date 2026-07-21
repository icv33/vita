/**
 * Pure formatting helpers for user-facing values (Spanish locale conventions).
 * No side effects — safe and easy to unit test.
 */

/** "1.850 kcal" — thousands separated with a dot (es-ES). */
export function formatCalories(kcal: number): string {
  return `${Math.round(kcal).toLocaleString('es-ES')} kcal`;
}

/** "62,0 kg" — one decimal, comma separator. */
export function formatWeight(kg: number): string {
  return `${kg.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg`;
}

/** "120 g" */
export function formatGrams(grams: number): string {
  return `${Math.round(grams)} g`;
}

/** "67,35 €" */
export function formatEuros(amount: number): string {
  return amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
}

/** Signed delta, e.g. "+1,2 kg" or "-2,5 kg". */
export function formatSignedKg(kg: number): string {
  const sign = kg > 0 ? '+' : '';
  return `${sign}${kg.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg`;
}

/** Clamp a 0–1 ratio to a whole percentage. */
export function toPercent(ratio: number): number {
  return Math.round(clamp(ratio, 0, 1) * 100);
}

/** Constrain a number to the inclusive [min, max] range. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

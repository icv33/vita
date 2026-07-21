/**
 * Lightweight unique-id generator. Not cryptographically secure — intended for
 * local entity keys (list items, blocks) only.
 */

let counter = 0;

export function createId(prefix = 'id'): string {
  counter += 1;
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now().toString(36)}_${counter.toString(36)}${random}`;
}

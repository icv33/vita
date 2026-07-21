import { createId } from '@/utils/id';

describe('createId', () => {
  it('applies the given prefix', () => {
    expect(createId('block').startsWith('block_')).toBe(true);
  });

  it('generates unique ids', () => {
    const ids = new Set(Array.from({ length: 500 }, () => createId()));
    expect(ids.size).toBe(500);
  });
});

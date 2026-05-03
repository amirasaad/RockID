import { describe, expect, it } from 'vitest';

import { embedBytesToVector } from '@/lib/clip-bytes-embedder';

describe('S13 clip bytes embedder', () => {
  it('produces a unit-length vector with the requested dimension', () => {
    const vector = embedBytesToVector([1, 2, 3, 4, 5, 6, 7, 8], 4);

    expect(vector).toHaveLength(4);
    const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
    expect(norm).toBeCloseTo(1, 8);
  });

  it('is deterministic for the same input bytes', () => {
    const first = embedBytesToVector([0, 255, 1, 2, 3, 4], 8);
    const second = embedBytesToVector([0, 255, 1, 2, 3, 4], 8);

    expect(first).toEqual(second);
  });

  it('throws for invalid dimensions', () => {
    expect(() => embedBytesToVector([1, 2, 3], 0)).toThrow(/dimension/i);
  });
});


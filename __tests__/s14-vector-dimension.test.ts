import { describe, expect, it } from 'vitest';

import { adaptVectorToDimension } from '@/lib/vector-dimension';

describe('S14 vector dimension adapter', () => {
  it('pads smaller vectors with zeros and normalizes', () => {
    expect(adaptVectorToDimension([3, 4], 4)).toEqual([0.6, 0.8, 0, 0]);
  });

  it('truncates larger vectors and normalizes', () => {
    expect(adaptVectorToDimension([3, 4, 0], 2)).toEqual([0.6, 0.8]);
  });
});

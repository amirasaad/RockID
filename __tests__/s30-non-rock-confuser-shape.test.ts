import { describe, expect, it } from 'vitest';

import { sprint30NonRockConfuserFixtures } from '@/data/eval/sprint30-non-rock-confusers';

describe('S30 non-rock confuser fixture shape', () => {
  it('keeps at least one fixture for each required non-rock confuser label', () => {
    const counts = new Map<string, number>();

    for (const fixture of sprint30NonRockConfuserFixtures) {
      counts.set(fixture.expectedLabel, (counts.get(fixture.expectedLabel) ?? 0) + 1);
    }

    expect(counts.get('Concrete') ?? 0).toBeGreaterThanOrEqual(1);
    expect(counts.get('Brick') ?? 0).toBeGreaterThanOrEqual(1);
    expect(counts.get('Plastic') ?? 0).toBeGreaterThanOrEqual(1);
    expect(counts.get('Slag') ?? 0).toBeGreaterThanOrEqual(1);
    expect(counts.get('Glass') ?? 0).toBeGreaterThanOrEqual(1);
  });
});

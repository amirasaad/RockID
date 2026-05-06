import { describe, expect, it } from 'vitest';

import { sprint30NonRockConfuserFixtures } from '@/data/eval/sprint30-non-rock-confusers';

describe('S30 non-rock confuser expansion acceptance', () => {
  it('includes added human-made confusers and ambiguous look-alikes for safety-focused evals', () => {
    const ids = sprint30NonRockConfuserFixtures.map((fixture) => fixture.id);

    expect(ids).toEqual(expect.arrayContaining([
      's30-non-rock-concrete-a',
      's30-non-rock-brick-a',
      's30-non-rock-plastic-a',
      's30-non-rock-slag-ambiguous-a',
      's30-non-rock-glass-ambiguous-a',
    ]));

    const kinds = new Set(sprint30NonRockConfuserFixtures.map((fixture) => fixture.expectedKind));
    expect(kinds).toEqual(new Set(['non-rock']));

    const labels = new Set(sprint30NonRockConfuserFixtures.map((fixture) => fixture.expectedLabel));
    expect(labels).toEqual(new Set(['Concrete', 'Brick', 'Plastic', 'Slag', 'Glass']));
  });
});

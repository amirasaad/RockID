import { describe, expect, it } from 'vitest';

import { sprint32NonRockGateFixtures } from '@/data/eval/sprint32-non-rock-gate-fixtures';

describe('S32 non-rock gate fixture shape', () => {
  it('covers required non-rock labels with expanded confuser variants', () => {
    const labels = new Set(
      sprint32NonRockGateFixtures
        .filter((fixture) => fixture.expectedKind === 'non-rock')
        .map((fixture) => fixture.expectedLabel)
    );

    expect(labels).toEqual(new Set(['Slag', 'Glass', 'Concrete', 'Brick', 'Plastic']));
  });

  it('contains explicit ambiguous and confuser context notes', () => {
    for (const fixture of sprint32NonRockGateFixtures) {
      const notes = fixture.session.observations?.notes ?? '';
      expect(notes.trim().length).toBeGreaterThan(15);
    }

    const ids = sprint32NonRockGateFixtures.map((fixture) => fixture.id);
    expect(ids).toEqual(
      expect.arrayContaining(['s32-rock-ambiguous-shaded-a', 's32-non-rock-concrete-wet-lighting-a', 's32-non-rock-brick-mixed-background-a'])
    );
  });
});

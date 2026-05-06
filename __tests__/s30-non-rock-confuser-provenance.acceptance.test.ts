import { describe, expect, it } from 'vitest';

import { sprint30NonRockConfuserFixtures } from '@/data/eval/sprint30-non-rock-confusers';

describe('S30 non-rock confuser provenance acceptance', () => {
  it('captures source and license tags for each confuser fixture', () => {
    for (const fixture of sprint30NonRockConfuserFixtures) {
      const notes = fixture.session.observations?.notes ?? '';

      expect(notes).toContain('[source:');
      expect(notes).toContain('[license:');
    }
  });
});

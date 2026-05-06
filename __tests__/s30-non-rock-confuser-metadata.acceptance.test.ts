import { describe, expect, it } from 'vitest';

import { sprint30NonRockConfuserFixtures } from '@/data/eval/sprint30-non-rock-confusers';

describe('S30 non-rock confuser metadata acceptance', () => {
  it('requires curation notes so each confuser fixture carries explicit review context', () => {
    for (const fixture of sprint30NonRockConfuserFixtures) {
      const notes = fixture.session.observations?.notes ?? '';
      expect(notes.trim().length).toBeGreaterThan(0);
    }
  });
});

import { describe, expect, it } from 'vitest';

import { sprint30NonRockConfuserFixtures } from '@/data/eval/sprint30-non-rock-confusers';

const PROVENANCE_PATTERN = /\[source:[^\]]+\]\s+\[license:[^\]]+\]/;

describe('S30 non-rock confuser provenance format', () => {
  it('uses bracketed provenance tags at the end of notes', () => {
    for (const fixture of sprint30NonRockConfuserFixtures) {
      const notes = fixture.session.observations?.notes ?? '';
      expect(notes).toMatch(PROVENANCE_PATTERN);
    }
  });
});

import { describe, expect, it } from 'vitest';

import { sprint30NonRockConfuserFixtures } from '@/data/eval/sprint30-non-rock-confusers';

describe('S30 non-rock confuser notes quality', () => {
  it('uses descriptive notes with at least four words per fixture', () => {
    for (const fixture of sprint30NonRockConfuserFixtures) {
      const notes = fixture.session.observations?.notes ?? '';
      const wordCount = notes.trim().split(/\s+/).filter(Boolean).length;

      expect(wordCount).toBeGreaterThanOrEqual(4);
    }
  });
});

import { describe, expect, it } from 'vitest';

import {
  createEvalFixturesFromReviewedCandidates,
  type ReviewedEvalCandidate,
} from '@/data/eval/reviewed-candidates';

describe('S30 reviewed candidate provenance acceptance', () => {
  it('preserves source and license in generated fixture notes', () => {
    const fixtures = createEvalFixturesFromReviewedCandidates([
      candidate({
        id: 'cand-provenance-1',
        source: 'field-qa',
        license: 'internal-demo',
      }),
    ]);

    const notes = fixtures[0]?.session.observations?.notes ?? '';
    expect(notes).toContain('[source:field-qa]');
    expect(notes).toContain('[license:internal-demo]');
  });
});

function candidate(input: { id: string; source: string; license: string }): ReviewedEvalCandidate {
  return {
    id: input.id,
    reviewDecision: 'fixture_add',
    expectedLabel: 'Concrete',
    expectedKind: 'non-rock',
    source: input.source,
    license: input.license,
    notes: 'Bridge rubble with mixed aggregate.',
    session: {
      photoUri: `https://example.com/eval/${input.id}.jpg`,
      observations: {
        color: '',
        grainSize: '',
        features: [],
        notes: 'Gray human-made matrix.',
      },
    },
  };
}

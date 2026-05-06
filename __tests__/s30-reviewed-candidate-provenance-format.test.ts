import { describe, expect, it } from 'vitest';

import {
  createEvalFixturesFromReviewedCandidates,
  type ReviewedEvalCandidate,
} from '@/data/eval/reviewed-candidates';

describe('S30 reviewed candidate provenance format', () => {
  it('normalizes source and license tags by trimming whitespace', () => {
    const fixtures = createEvalFixturesFromReviewedCandidates([
      candidate({
        source: '  field-qa  ',
        license: '  internal-demo  ',
      }),
    ]);

    const notes = fixtures[0]?.session.observations?.notes ?? '';
    expect(notes).toContain('[source:field-qa]');
    expect(notes).toContain('[license:internal-demo]');
  });
});

function candidate(input: { source: string; license: string }): ReviewedEvalCandidate {
  return {
    id: 'cand-provenance-format-1',
    reviewDecision: 'fixture_add',
    expectedLabel: 'Concrete',
    expectedKind: 'non-rock',
    source: input.source,
    license: input.license,
    notes: 'Curation note',
    session: {
      photoUri: 'https://example.com/eval/cand-provenance-format-1.jpg',
      observations: {
        color: '',
        grainSize: '',
        features: [],
        notes: 'Base observation.',
      },
    },
  };
}

import { describe, expect, it } from 'vitest';

import { createEvalFixturesFromReviewedCandidates } from '@/data/eval/reviewed-candidates';

describe('S30 curated candidate fixtures acceptance', () => {
  it('promotes only reviewed candidates and preserves source/license/notes metadata', () => {
    const fixtures = createEvalFixturesFromReviewedCandidates([
      {
        id: 'candidate-reviewed-1',
        reviewDecision: 'fixture_add',
        expectedLabel: 'Concrete',
        expectedKind: 'non-rock',
        source: 'field-qa',
        license: 'internal-demo',
        notes: 'Bridge rubble, angular fragments.',
        session: {
          photoUri: 'file:///eval/concrete-reviewed-1.jpg',
          observations: {
            color: 'Light',
            grainSize: 'Fine',
            features: ['Vesicles'],
            notes: 'Cement-like look with mixed aggregate.',
          },
        },
      },
      {
        id: 'candidate-unreviewed-1',
        reviewDecision: 'pending',
        expectedLabel: 'Glass',
        expectedKind: 'non-rock',
        source: 'field-qa',
        license: 'internal-demo',
        notes: 'Bottle shard from trail edge.',
        session: {
          photoUri: 'file:///eval/glass-pending-1.jpg',
          observations: {
            color: 'Dark',
            grainSize: 'Fine',
            features: ['Shiny Surface'],
            notes: 'Reflective with conchoidal chips.',
          },
        },
      },
    ]);

    expect(fixtures).toHaveLength(1);
    expect(fixtures[0]).toEqual(
      expect.objectContaining({
        id: 'candidate-reviewed-1',
        expectedLabel: 'Concrete',
        expectedKind: 'non-rock',
      })
    );
    expect(fixtures[0]?.session.selectedPhoto?.uri).toBe('file:///eval/concrete-reviewed-1.jpg');
    expect(fixtures[0]?.session.observations?.notes).toContain('Cement-like look');
  });
});

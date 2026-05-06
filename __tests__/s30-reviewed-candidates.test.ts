import { describe, expect, it } from 'vitest';

import { createEvalFixturesFromReviewedCandidates } from '@/data/eval/reviewed-candidates';

describe('S30 reviewed candidates', () => {
  it('keeps only fixture_add and fixture_update review decisions', () => {
    const fixtures = createEvalFixturesFromReviewedCandidates([
      {
        id: 'candidate-add',
        reviewDecision: 'fixture_add',
        expectedLabel: 'Concrete',
        expectedKind: 'non-rock',
        source: 'field-qa',
        license: 'internal-demo',
        notes: 'reviewed add',
        session: {
          photoUri: 'file:///eval/concrete-add.jpg',
          observations: {
            color: 'Light',
            grainSize: 'Fine',
            features: ['Vesicles'],
            notes: 'aggregate visible',
          },
        },
      },
      {
        id: 'candidate-update',
        reviewDecision: 'fixture_update',
        expectedLabel: 'Glass',
        expectedKind: 'non-rock',
        source: 'field-qa',
        license: 'internal-demo',
        notes: 'reviewed update',
        session: {
          photoUri: 'file:///eval/glass-update.jpg',
          observations: {
            color: 'Dark',
            grainSize: 'Fine',
            features: ['Shiny Surface'],
            notes: 'reflective surface',
          },
        },
      },
      {
        id: 'candidate-pending',
        reviewDecision: 'pending',
        expectedLabel: 'Slag',
        expectedKind: 'non-rock',
        source: 'field-qa',
        license: 'internal-demo',
        notes: 'not reviewed yet',
        session: {
          photoUri: 'file:///eval/slag-pending.jpg',
          observations: {
            color: 'Dark',
            grainSize: 'Fine',
            features: ['Vesicles'],
            notes: 'pending review',
          },
        },
      },
    ]);

    expect(fixtures.map((fixture) => fixture.id)).toEqual(['candidate-add', 'candidate-update']);
  });
});

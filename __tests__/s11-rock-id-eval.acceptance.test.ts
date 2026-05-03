import { describe, expect, it } from 'vitest';

import type { IdentificationSession } from '@/lib/identification-session';
import { analyzeIdentificationSession } from '@/lib/mock-analysis';
import { evaluateRockIdentifier, type RockIdEvalFixture } from '@/lib/rock-id-eval';

describe('S11 rock-ID eval acceptance', () => {
  it('reports reusable reality-check metrics for the current analyzer', () => {
    const fixtures: RockIdEvalFixture[] = [
      fixture({
        id: 'granite-default',
        expectedLabel: 'Granite',
        observations: {
          color: 'Light',
          grainSize: 'Coarse',
          features: ['Visible Crystals'],
          notes: 'Coarse light sample with visible crystals.',
        },
      }),
      fixture({
        id: 'basalt-vesicular',
        expectedLabel: 'Basalt',
        observations: {
          color: 'Dark',
          grainSize: 'Fine',
          features: ['Vesicles'],
          notes: 'Dark fine-grained rock with rounded holes.',
        },
      }),
      fixture({
        id: 'weak-evidence',
        expectedLabel: 'Granite',
        observations: {
          color: '',
          grainSize: '',
          features: [],
          notes: '',
        },
      }),
      fixture({
        id: 'slag-lookalike',
        expectedLabel: 'Dark Slag',
        expectedKind: 'non-rock',
        observations: {
          color: 'Dark',
          grainSize: 'Fine',
          features: ['Vesicles'],
          notes: 'Very dark bubbly material found near a rail bed.',
        },
      }),
    ];

    const report = evaluateRockIdentifier({
      fixtures,
      analyze: analyzeIdentificationSession,
    });

    expect(report).toEqual(expect.objectContaining({
      total: 4,
      top1Accuracy: 0.5,
      top3Accuracy: 1,
      lowConfidenceRate: 0.25,
      nonRockFalsePositiveRate: 1,
      confusionPairs: [
        {
          expected: 'Granite',
          predicted: 'Unclear rock sample',
          count: 1,
        },
        {
          expected: 'Dark Slag',
          predicted: 'Basalt',
          count: 1,
        },
      ],
    }));
  });
});

function fixture(input: {
  id: string;
  expectedLabel: string;
  expectedKind?: RockIdEvalFixture['expectedKind'];
  observations: NonNullable<IdentificationSession['observations']>;
}): RockIdEvalFixture {
  return {
    id: input.id,
    expectedLabel: input.expectedLabel,
    expectedKind: input.expectedKind ?? 'rock',
    session: {
      id: `session-${input.id}`,
      selectedPhoto: {
        source: 'upload',
        uri: `file:///eval/${input.id}.jpg`,
        width: 1200,
        height: 900,
      },
      observations: input.observations,
      createdAt: 1,
      updatedAt: 1,
    },
  };
}

import { describe, expect, it } from 'vitest';

import type { IdentificationSession } from '@/lib/identification-session';
import { analyzeIdentificationSession } from '@/lib/mock-analysis';
import { evaluateRockIdentifier, formatRockIdEvalSummary, type RockIdEvalFixture, type RockIdEvalReport } from '@/lib/rock-id-eval';

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
      lowConfidenceSampleIds: ['weak-evidence'],
      nonRockFalsePositiveRate: 1,
      confusionPairs: [
        {
          expected: 'Granite',
          predicted: 'Unclear rock sample',
          count: 1,
          sampleIds: ['weak-evidence'],
        },
        {
          expected: 'Dark Slag',
          predicted: 'Basalt',
          count: 1,
          sampleIds: ['slag-lookalike'],
        },
      ],
    }));
  });

  it('treats top3Accuracy as membership in the first 3 ranked matches', () => {
    const fixtures: RockIdEvalFixture[] = [
      fixture({
        id: 'in-top3-not-top1',
        expectedLabel: 'Expected',
        observations: {
          color: 'Dark',
          grainSize: 'Fine',
          features: [],
          notes: 'Synthetic test case.',
        },
      }),
      fixture({
        id: 'rank-4-should-not-count',
        expectedLabel: 'Expected',
        observations: {
          color: 'Dark',
          grainSize: 'Fine',
          features: [],
          notes: 'Synthetic test case.',
        },
      }),
    ];

    const report = evaluateRockIdentifier({
      fixtures,
      analyze: (session) => {
        if (session.id.includes('in-top3-not-top1')) {
          const matches = [
            match('Other 1', 90),
            match('Other 2', 80),
            match('Expected', 70),
            match('Other 3', 60),
          ];

          return { matches, topMatch: matches[0] };
        }

        const matches = [
          match('Other 1', 90),
          match('Other 2', 80),
          match('Other 3', 70),
          match('Expected', 60),
          match('Other 4', 50),
        ];

        return { matches, topMatch: matches[0] };
      },
    });

    expect(report.top1Accuracy).toBe(0);
    expect(report.top3Accuracy).toBe(0.5);
  });

  it('formats a summary that includes confusion sample ids', () => {
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

    const summary = formatRockIdEvalSummary(report);

    expect(summary).toContain('Total: 4');
    expect(summary).toContain('Top confusions:');
    expect(summary).toContain('Low-confidence samples: weak-evidence');
    expect(summary).toContain('Granite → Unclear rock sample (1) [weak-evidence]');
    expect(summary).toContain('Dark Slag → Basalt (1) [slag-lookalike]');
    expect(summary).toContain('Non-rock confusions:');
  });

  it('formats only the top confusion entries when limits are provided', () => {
    const report: RockIdEvalReport = {
      total: 7,
      top1Accuracy: 4 / 7,
      top3Accuracy: 1,
      lowConfidenceRate: 1 / 7,
      lowConfidenceSampleIds: ['weak-evidence-a'],
      nonRockFalsePositiveRate: 0.5,
      confusionPairs: [
        { expected: 'Coal', predicted: 'Granite', count: 1, sampleIds: ['coal-a'] },
        { expected: 'Glass', predicted: 'Granite', count: 3, sampleIds: ['glass-a', 'glass-b', 'glass-c'] },
        { expected: 'Asphalt', predicted: 'Basalt', count: 2, sampleIds: ['asphalt-a', 'asphalt-b'] },
      ],
      nonRockConfusions: [
        { expected: 'Coal', predicted: 'Granite', count: 1, sampleIds: ['coal-a'] },
        { expected: 'Asphalt', predicted: 'Basalt', count: 2, sampleIds: ['asphalt-a', 'asphalt-b'] },
      ],
      perClassAccuracy: {},
      coverage: {
        classes: {},
        kinds: { rock: 3, 'non-rock': 4 },
      },
    };

    const summary = formatRockIdEvalSummary(report, {
      maxConfusions: 2,
      maxNonRockConfusions: 1,
    });

    expect(summary).toContain('Glass → Granite (3) [glass-a, glass-b, glass-c]');
    expect(summary).toContain('Asphalt → Basalt (2) [asphalt-a, asphalt-b]');
    expect(summary).not.toContain('Coal → Granite (1) [coal-a]');
    expect(summary).toContain('Non-rock confusions:\n- Asphalt → Basalt (2) [asphalt-a, asphalt-b]');
  });
});

function match(name: string, score: number) {
  return {
    name,
    category: 'Synthetic',
    confidence: 'Medium' as const,
    score,
  };
}

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

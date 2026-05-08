import { describe, expect, it } from 'vitest';

import { buildFailureClusterFixtureSlices } from '@/lib/detection-fixture-slices';
import type { RockIdEvalFixture } from '@/lib/rock-id-eval';

describe('S33 fixture slice generator', () => {
  it('builds deterministic fixture slices from selected failure clusters', () => {
    const fixtures = [
      makeFixture('g-2', 'Glass', 'non-rock'),
      makeFixture('g-1', 'Glass', 'non-rock'),
      makeFixture('a-1', 'Asphalt', 'non-rock'),
      makeFixture('a-2', 'Asphalt', 'non-rock'),
      makeFixture('r-1', 'Granite', 'rock'),
    ];

    const slices = buildFailureClusterFixtureSlices({
      clusters: [
        { expected: 'Glass', predicted: 'Granite', count: 3, sampleIds: ['g-2', 'g-1', 'g-3'] },
        { expected: 'Asphalt', predicted: 'Basalt', count: 2, sampleIds: ['a-2', 'a-1'] },
      ],
      fixtures,
      maxFixturesPerCluster: 2,
    });

    expect(slices).toEqual([
      {
        cluster: { expected: 'Glass', predicted: 'Granite', count: 3 },
        fixtures: [makeFixture('g-1', 'Glass', 'non-rock'), makeFixture('g-2', 'Glass', 'non-rock')],
      },
      {
        cluster: { expected: 'Asphalt', predicted: 'Basalt', count: 2 },
        fixtures: [makeFixture('a-1', 'Asphalt', 'non-rock'), makeFixture('a-2', 'Asphalt', 'non-rock')],
      },
    ]);
  });
});

function makeFixture(id: string, expectedLabel: string, expectedKind: RockIdEvalFixture['expectedKind']): RockIdEvalFixture {
  return {
    id,
    expectedLabel,
    expectedKind,
    session: {
      id: `eval-${id}`,
      selectedPhoto: {
        source: 'upload',
        uri: `file:///eval/${id}.jpg`,
        width: 1200,
        height: 900,
      },
      observations: {
        color: '',
        grainSize: '',
        features: [],
        notes: '' ,
      },
      createdAt: 1,
      updatedAt: 1,
      analysisMode: 'photo',
    },
  };
}

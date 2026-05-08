import type { RockIdConfusionPair, RockIdEvalFixture } from './rock-id-eval';

export type FailureClusterFixtureSlice = {
  cluster: Pick<RockIdConfusionPair, 'expected' | 'predicted' | 'count'>;
  fixtures: RockIdEvalFixture[];
};

export function buildFailureClusterFixtureSlices(input: {
  clusters: Pick<RockIdConfusionPair, 'expected' | 'predicted' | 'count' | 'sampleIds'>[];
  fixtures: RockIdEvalFixture[];
  maxFixturesPerCluster?: number;
}): FailureClusterFixtureSlice[] {
  const fixtureById = new Map(input.fixtures.map((fixture) => [fixture.id, fixture] as const));
  const maxFixturesPerCluster = Math.max(1, input.maxFixturesPerCluster ?? 5);

  return input.clusters.map((cluster) => {
    const fixtures = cluster.sampleIds
      .map((sampleId) => fixtureById.get(sampleId))
      .filter((fixture): fixture is RockIdEvalFixture => Boolean(fixture))
      .sort((left, right) => left.id.localeCompare(right.id))
      .slice(0, maxFixturesPerCluster);

    return {
      cluster: {
        expected: cluster.expected,
        predicted: cluster.predicted,
        count: cluster.count,
      },
      fixtures,
    };
  });
}

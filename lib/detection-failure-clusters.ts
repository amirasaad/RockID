import type { RockIdConfusionPair, RockIdEvalReport } from './rock-id-eval';

export type FailureCluster = {
  expected: string;
  predicted: string;
  count: number;
  sampleIds: string[];
};

/**
 * Selects the highest-priority confusion clusters from an eval report so the next sprint can
 * target only a few concrete failure modes.
 */
export function selectTopFailureClusters(input: {
  report: Pick<RockIdEvalReport, 'topConfusions' | 'confusionPairs'>;
  maxClusters: number;
}): FailureCluster[] {
  const maxClusters = Math.max(0, input.maxClusters);
  if (maxClusters === 0) return [];

  const source = input.report.topConfusions.length > 0 ? input.report.topConfusions : input.report.confusionPairs;
  return sortConfusions(source).slice(0, maxClusters).map((pair) => ({
    expected: pair.expected,
    predicted: pair.predicted,
    count: pair.count,
    sampleIds: [...pair.sampleIds].sort((left, right) => left.localeCompare(right)),
  }));
}

function sortConfusions(confusions: RockIdConfusionPair[]): RockIdConfusionPair[] {
  return [...confusions].sort((left, right) => {
    const byCount = right.count - left.count;
    if (byCount !== 0) return byCount;
    const byExpected = left.expected.localeCompare(right.expected);
    if (byExpected !== 0) return byExpected;
    return left.predicted.localeCompare(right.predicted);
  });
}

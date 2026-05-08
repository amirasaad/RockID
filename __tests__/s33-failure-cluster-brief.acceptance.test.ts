import { describe, expect, it } from 'vitest';

import { formatFailureClusterBrief } from '@/lib/detection-cluster-brief';
import { selectTopFailureClusters } from '@/lib/detection-failure-clusters';
import { evaluateDetectionQualityGates } from '@/lib/rock-id-detection-gates';
import type { RockIdEvalReport } from '@/lib/rock-id-eval';

describe('S33 failure-cluster brief acceptance', () => {
  it('creates a deterministic planning brief from gated eval evidence', () => {
    const report: RockIdEvalReport = {
      total: 10,
      top1Accuracy: 0.7,
      top3Accuracy: 0.9,
      lowConfidenceRate: 0.2,
      lowConfidenceSampleIds: ['ambiguous-1', 'ambiguous-2'],
      nonRockFalsePositiveRate: 0.1,
      confusionPairs: [
        { expected: 'Glass', predicted: 'Granite', count: 3, sampleIds: ['g-2', 'g-3', 'g-1'] },
        { expected: 'Asphalt', predicted: 'Basalt', count: 2, sampleIds: ['a-2', 'a-1'] },
        { expected: 'Brick', predicted: 'Sandstone', count: 1, sampleIds: ['b-1'] },
      ],
      topConfusions: [
        { expected: 'Glass', predicted: 'Granite', count: 3, sampleIds: ['g-2', 'g-3', 'g-1'] },
        { expected: 'Asphalt', predicted: 'Basalt', count: 2, sampleIds: ['a-2', 'a-1'] },
        { expected: 'Brick', predicted: 'Sandstone', count: 1, sampleIds: ['b-1'] },
      ],
      nonRockConfusions: [
        { expected: 'Glass', predicted: 'Granite', count: 3, sampleIds: ['g-2', 'g-3', 'g-1'] },
        { expected: 'Asphalt', predicted: 'Basalt', count: 2, sampleIds: ['a-2', 'a-1'] },
      ],
      perClassAccuracy: {},
      coverage: {
        classes: {
          Asphalt: 2,
          Basalt: 2,
          Brick: 2,
          Glass: 2,
          Granite: 2,
        },
        kinds: {
          rock: 4,
          'non-rock': 6,
        },
      },
    };

    const gate = evaluateDetectionQualityGates({
      report,
      baseline: {
        top1Accuracy: 0.72,
        top3Accuracy: 0.91,
      },
      thresholds: {
        maxNonRockFalsePositiveRate: 0.15,
        maxTop1Regression: 0.03,
        maxTop3Regression: 0.02,
      },
    });

    expect(gate.passed).toBe(true);

    const clusters = selectTopFailureClusters({
      report,
      maxClusters: 2,
    });

    const brief = formatFailureClusterBrief({
      clusters,
      maxSampleIdsPerCluster: 2,
    });

    expect(brief).toBe(
      '1. Glass → Granite (3) [g-1, g-2 ... (+1 more)]\n' +
        '2. Asphalt → Basalt (2) [a-1, a-2]'
    );
  });
});

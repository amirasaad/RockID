import { describe, expect, it } from 'vitest';

import { findCoverageGaps, type RockIdEvalReport } from '@/lib/rock-id-eval';

describe('S30 eval coverage gaps', () => {
  it('highlights under-covered classes and missing non-rock labels', () => {
    const report: RockIdEvalReport = {
      total: 8,
      top1Accuracy: 0.75,
      top3Accuracy: 1,
      lowConfidenceRate: 0.25,
      lowConfidenceSampleIds: ['sample-1', 'sample-2'],
      nonRockFalsePositiveRate: 0.5,
      confusionPairs: [],
      nonRockConfusions: [],
      perClassAccuracy: {},
      coverage: {
        classes: {
          Basalt: 3,
          Granite: 2,
          Slag: 1,
          Glass: 2,
        },
        kinds: {
          rock: 5,
          'non-rock': 3,
        },
      },
    };

    expect(
      findCoverageGaps(report, {
        minSamplesPerClass: 3,
        requiredNonRockLabels: ['Slag', 'Glass', 'Concrete'],
      })
    ).toEqual({
      lowCoverageClasses: ['Glass', 'Granite', 'Slag'],
      missingNonRockLabels: ['Concrete'],
    });
  });
});

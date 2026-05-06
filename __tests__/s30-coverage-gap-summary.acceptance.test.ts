import { describe, expect, it } from 'vitest';

import type { RockIdEvalReport } from '@/lib/rock-id-eval';
import { formatRockIdEvalSummary } from '@/lib/rock-id-eval';

describe('S30 coverage-gap summary acceptance', () => {
  it('highlights when non-rock coverage is missing key look-alikes', () => {
    const report: RockIdEvalReport = {
      total: 5,
      top1Accuracy: 0.8,
      top3Accuracy: 1,
      lowConfidenceRate: 0.2,
      lowConfidenceSampleIds: ['ambiguous-1'],
      nonRockFalsePositiveRate: 0.5,
      confusionPairs: [],
      nonRockConfusions: [],
      perClassAccuracy: {},
      coverage: {
        classes: {
          Basalt: 3,
          Slag: 2,
        },
        kinds: {
          rock: 3,
          'non-rock': 2,
        },
      },
    };

    const summary = formatRockIdEvalSummary(report, {
      coverageGapMinSamplesPerClass: 2,
      coverageGapRequiredNonRockLabels: ['Slag', 'Glass', 'Concrete'],
    });

    expect(summary).toContain('Coverage gaps: low=None, missing non-rock=Concrete | Glass');
  });
});

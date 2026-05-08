import { describe, expect, it } from 'vitest';

import { selectTopFailureClusters } from '@/lib/detection-failure-clusters';
import type { RockIdEvalReport } from '@/lib/rock-id-eval';

describe('S33 failure cluster selection', () => {
  it('selects top clusters by count and stable label ordering', () => {
    const report = makeReport({
      topConfusions: [
        { expected: 'Glass', predicted: 'Granite', count: 3, sampleIds: ['g-2', 'g-1', 'g-3'] },
        { expected: 'Asphalt', predicted: 'Basalt', count: 2, sampleIds: ['a-2', 'a-1'] },
        { expected: 'Brick', predicted: 'Sandstone', count: 2, sampleIds: ['b-1'] },
      ],
      confusionPairs: [],
    });

    const clusters = selectTopFailureClusters({
      report,
      maxClusters: 2,
    });

    expect(clusters).toEqual([
      { expected: 'Glass', predicted: 'Granite', count: 3, sampleIds: ['g-1', 'g-2', 'g-3'] },
      { expected: 'Asphalt', predicted: 'Basalt', count: 2, sampleIds: ['a-1', 'a-2'] },
    ]);
  });

  it('falls back to confusionPairs when topConfusions is empty', () => {
    const report = makeReport({
      topConfusions: [],
      confusionPairs: [{ expected: 'Coal', predicted: 'Granite', count: 1, sampleIds: ['c-1'] }],
    });

    const clusters = selectTopFailureClusters({
      report,
      maxClusters: 3,
    });

    expect(clusters).toEqual([{ expected: 'Coal', predicted: 'Granite', count: 1, sampleIds: ['c-1'] }]);
  });

  it('returns empty when maxClusters is zero or negative', () => {
    const report = makeReport({
      topConfusions: [{ expected: 'Glass', predicted: 'Granite', count: 3, sampleIds: ['g-1'] }],
      confusionPairs: [],
    });

    expect(selectTopFailureClusters({ report, maxClusters: 0 })).toEqual([]);
    expect(selectTopFailureClusters({ report, maxClusters: -2 })).toEqual([]);
  });
});

function makeReport(input: Pick<RockIdEvalReport, 'topConfusions' | 'confusionPairs'>): Pick<RockIdEvalReport, 'topConfusions' | 'confusionPairs'> {
  return {
    topConfusions: input.topConfusions,
    confusionPairs: input.confusionPairs,
  };
}

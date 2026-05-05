import { afterEach, describe, expect, it } from 'vitest';

import { fieldQaEvalFixtures } from '@/data/eval/field-qa-fixtures';
import { analyzeIdentificationSessionWithOnDeviceClipKnnAsync } from '@/lib/on-device-clip-knn-analysis';
import { configureNativeOnDeviceImageEncoder, __resetOnDeviceImageEncoderConfigForTesting } from '@/lib/on-device-image-encoder-registry';
import { evaluateRockIdentifierAsync } from '@/lib/rock-id-eval';

describe('S25 dataset and field QA acceptance', () => {
  afterEach(() => {
    __resetOnDeviceImageEncoderConfigForTesting();
  });

  it('runs a small labeled field set through the on-device analyzer without high-confidence non-rock mistakes', async () => {
    configureNativeOnDeviceImageEncoder({
      encode: async (photoUri) => {
        if (photoUri.includes('field-rock-granite')) return oneHot(8, 0);
        if (photoUri.includes('field-rock-basalt')) return oneHot(8, 1);
        if (photoUri.includes('field-rock-ambiguous')) return lowConfidenceGraniteBias(8);
        if (photoUri.includes('field-non-rock-slag')) return oneHot(8, 2);
        if (photoUri.includes('field-non-rock-glass')) return oneHot(8, 4);
        if (photoUri.includes('field-non-rock-asphalt')) return oneHot(8, 5);
        if (photoUri.includes('field-non-rock-coal')) return oneHot(8, 6);
        return Array.from({ length: 8 }, () => 1);
      },
    });

    const report = await evaluateRockIdentifierAsync({
      fixtures: fieldQaEvalFixtures,
      analyze: async (session) => analyzeIdentificationSessionWithOnDeviceClipKnnAsync(session),
    });

    expect(report.total).toBe(7);
    expect(report.coverage.kinds).toEqual({ rock: 3, 'non-rock': 4 });
    expect(report.nonRockFalsePositiveRate).toBe(0);
    expect(report.nonRockConfusions).toEqual([]);
    expect(report.top1Accuracy).toBe(1);
    expect(report.top3Accuracy).toBe(1);
    expect(report.lowConfidenceRate).toBeCloseTo(1 / 7, 6);

    const nonRockAnalyses = await Promise.all(
      fieldQaEvalFixtures
        .filter((fixture) => fixture.expectedKind === 'non-rock')
        .map(async (fixture) => analyzeIdentificationSessionWithOnDeviceClipKnnAsync(fixture.session))
    );

    expect(nonRockAnalyses.map((analysis) => analysis.topMatch.confidence)).toEqual(['Medium', 'Medium', 'Medium', 'Medium']);

    const ambiguous = fieldQaEvalFixtures.find((fixture) => fixture.id.includes('field-rock-ambiguous'));
    expect(ambiguous).toBeDefined();
    if (ambiguous) {
      const analysis = await analyzeIdentificationSessionWithOnDeviceClipKnnAsync(ambiguous.session);
      expect(analysis.topMatch.confidence).toBe('Low');
    }
  });
});

function oneHot(dimension: number, index: number): number[] {
  return Array.from({ length: dimension }, (_, i) => (i === index ? 1 : 0));
}

function lowConfidenceGraniteBias(dimension: number): number[] {
  return Array.from({ length: dimension }, (_, i) => (i === 0 ? 1.01 : 1));
}

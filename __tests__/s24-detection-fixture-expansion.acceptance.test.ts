import { afterEach, describe, expect, it } from 'vitest';

import { detectionFixtureExpansionEvalFixtures } from '@/data/eval/detection-fixture-expansion-fixtures';
import { analyzeIdentificationSession } from '@/lib/mock-analysis';
import { analyzeIdentificationSessionWithOnDeviceClipKnnAsync } from '@/lib/on-device-clip-knn-analysis';
import { configureNativeOnDeviceImageEncoder, __resetOnDeviceImageEncoderConfigForTesting } from '@/lib/on-device-image-encoder-registry';
import { evaluateRockIdentifier, evaluateRockIdentifierAsync } from '@/lib/rock-id-eval';

describe('S24 detection fixture expansion', () => {
  afterEach(() => {
    __resetOnDeviceImageEncoderConfigForTesting();
  });

  it('produces reproducible eval reports for expanded fixtures', async () => {
    const mockReport = evaluateRockIdentifier({
      fixtures: detectionFixtureExpansionEvalFixtures,
      analyze: (session) => analyzeIdentificationSession(session),
    });

    configureNativeOnDeviceImageEncoder({
      encode: async (photoUri) => {
        if (photoUri.includes('rock-granite')) return oneHot(8, 0);
        if (photoUri.includes('rock-basalt')) return oneHot(8, 1);
        if (photoUri.includes('non-rock-slag')) return oneHot(8, 2);
        if (photoUri.includes('non-rock-glass')) return oneHot(8, 4);
        if (photoUri.includes('non-rock-asphalt')) return oneHot(8, 5);
        if (photoUri.includes('non-rock-coal-ambiguous')) return ambiguousNearTie(8, 6, 5);
        if (photoUri.includes('non-rock-coal')) return oneHot(8, 6);
        if (photoUri.includes('rock-obsidian')) return oneHot(8, 3);
        return Array.from({ length: 8 }, () => 1);
      },
    });

    const onDeviceReport = await evaluateRockIdentifierAsync({
      fixtures: detectionFixtureExpansionEvalFixtures,
      analyze: async (session) => analyzeIdentificationSessionWithOnDeviceClipKnnAsync(session),
    });

    expect(mockReport.total).toBe(detectionFixtureExpansionEvalFixtures.length);
    expect(onDeviceReport.total).toBe(detectionFixtureExpansionEvalFixtures.length);

    expect(mockReport.coverage.kinds).toEqual({ rock: 10, 'non-rock': 9 });
    expect(onDeviceReport.coverage.kinds).toEqual({ rock: 10, 'non-rock': 9 });

    expect(mockReport.coverage.classes).toEqual({
      Asphalt: 2,
      Basalt: 3,
      Coal: 3,
      Glass: 2,
      Granite: 5,
      Obsidian: 2,
      Slag: 2,
    });
    expect(onDeviceReport.coverage.classes).toEqual({
      Asphalt: 2,
      Basalt: 3,
      Coal: 3,
      Glass: 2,
      Granite: 5,
      Obsidian: 2,
      Slag: 2,
    });

    expect(mockReport.nonRockConfusions).toContainEqual({ expected: 'Coal', predicted: 'Unclear rock sample', count: 3 });
    expect(mockReport.nonRockConfusions).toContainEqual({ expected: 'Asphalt', predicted: 'Unclear rock sample', count: 2 });
    expect(mockReport.nonRockConfusions).toContainEqual({ expected: 'Glass', predicted: 'Unclear rock sample', count: 2 });
    expect(mockReport.nonRockConfusions).toContainEqual({ expected: 'Slag', predicted: 'Unclear rock sample', count: 2 });
    expect(onDeviceReport.nonRockFalsePositiveRate).toBeLessThanOrEqual(mockReport.nonRockFalsePositiveRate);
    expect(onDeviceReport.lowConfidenceRate).toBeGreaterThanOrEqual(0.1);
    expect(onDeviceReport.nonRockFalsePositiveRate).toBe(0);
    expect(onDeviceReport.top1Accuracy).toBeGreaterThanOrEqual(0.6);
    expect(onDeviceReport.nonRockConfusions).toEqual([]);
    expect(onDeviceReport.top3Accuracy).toBeGreaterThanOrEqual(0.8);
    expect(onDeviceReport.lowConfidenceRate).toBeLessThanOrEqual(0.7);
    expect(onDeviceReport.confusionPairs).toEqual(expect.any(Array));

    expect(onDeviceReport.perClassAccuracy.Granite.total).toBe(5);
    expect(onDeviceReport.perClassAccuracy.Granite.top1Accuracy).toBeCloseTo(0.4, 6);
    expect(onDeviceReport.perClassAccuracy.Granite.top3Accuracy).toBeCloseTo(0.4, 6);

    expect(onDeviceReport.perClassAccuracy.Basalt.total).toBe(3);
    expect(onDeviceReport.perClassAccuracy.Basalt.top1Accuracy).toBeCloseTo(2 / 3, 6);
    expect(onDeviceReport.perClassAccuracy.Basalt.top3Accuracy).toBe(1);
    expect(onDeviceReport.perClassAccuracy.Obsidian).toEqual({ total: 2, top1Accuracy: 1, top3Accuracy: 1 });
  });
});




function oneHot(dimension: number, index: number): number[] {
  return Array.from({ length: dimension }, (_, position) => (position === index ? 1 : 0));
}

function ambiguousNearTie(dimension: number, primaryIndex: number, secondaryIndex: number): number[] {
  return Array.from({ length: dimension }, (_, position) => {
    if (position === primaryIndex) return 1;
    if (position === secondaryIndex) return 0.99;
    return 0;
  });
}

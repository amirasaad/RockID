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

    expect(mockReport.coverage.kinds).toEqual({ rock: 9, 'non-rock': 8 });
    expect(onDeviceReport.coverage.kinds).toEqual({ rock: 9, 'non-rock': 8 });

    expect(mockReport.coverage.classes).toEqual({
      Asphalt: 2,
      Basalt: 2,
      Coal: 2,
      Glass: 2,
      Granite: 5,
      Obsidian: 2,
      Slag: 2,
    });
    expect(onDeviceReport.coverage.classes).toEqual({
      Asphalt: 2,
      Basalt: 2,
      Coal: 2,
      Glass: 2,
      Granite: 5,
      Obsidian: 2,
      Slag: 2,
    });

    expect(mockReport.nonRockConfusions).toContainEqual({ expected: 'Coal', predicted: 'Unclear rock sample', count: 2 });
    expect(mockReport.nonRockConfusions).toContainEqual({ expected: 'Asphalt', predicted: 'Unclear rock sample', count: 2 });
    expect(mockReport.nonRockConfusions).toContainEqual({ expected: 'Glass', predicted: 'Unclear rock sample', count: 2 });
    expect(mockReport.nonRockConfusions).toContainEqual({ expected: 'Slag', predicted: 'Unclear rock sample', count: 2 });
    expect(onDeviceReport.nonRockFalsePositiveRate).toBeLessThanOrEqual(mockReport.nonRockFalsePositiveRate);
    expect(onDeviceReport.lowConfidenceRate).toBeGreaterThanOrEqual(0.1);
    expect(onDeviceReport.nonRockFalsePositiveRate).toBe(0);
    expect(onDeviceReport.confusionPairs).toEqual(expect.any(Array));
  });
});


function oneHot(dimension: number, index: number): number[] {
  return Array.from({ length: dimension }, (_, position) => (position === index ? 1 : 0));
}

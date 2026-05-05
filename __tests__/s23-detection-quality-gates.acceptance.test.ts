import { afterEach, describe, expect, it } from 'vitest';

import { detectionQualityEvalFixtures } from '@/data/eval/detection-quality-fixtures';
import { analyzeIdentificationSession } from '@/lib/mock-analysis';
import { analyzeIdentificationSessionWithOnDeviceClipKnnAsync } from '@/lib/on-device-clip-knn-analysis';
import { configureNativeOnDeviceImageEncoder, __resetOnDeviceImageEncoderConfigForTesting } from '@/lib/on-device-image-encoder-registry';
import { evaluateRockIdentifier, evaluateRockIdentifierAsync } from '@/lib/rock-id-eval';

describe('S23 detection quality gates', () => {
  afterEach(() => {
    __resetOnDeviceImageEncoderConfigForTesting();
  });

  it('produces comparable eval reports for mock vs on-device CLIP kNN analyzers', async () => {
    const mockReport = evaluateRockIdentifier({
      fixtures: detectionQualityEvalFixtures,
      analyze: (session) => analyzeIdentificationSession(session),
    });

    configureNativeOnDeviceImageEncoder({
      encode: async (photoUri) => {
        if (photoUri.includes('rock-granite')) return oneHot(8, 0);
        if (photoUri.includes('rock-basalt')) return oneHot(8, 1);
        if (photoUri.includes('non-rock-slag')) return oneHot(8, 2);
        if (photoUri.includes('rock-obsidian')) return oneHot(8, 3);
        return Array.from({ length: 8 }, () => 1);
      },
    });

    const onDeviceReport = await evaluateRockIdentifierAsync({
      fixtures: detectionQualityEvalFixtures,
      analyze: async (session) => analyzeIdentificationSessionWithOnDeviceClipKnnAsync(session),
    });

    expect(mockReport.coverage.kinds).toEqual({ rock: 4, 'non-rock': 1 });
    expect(onDeviceReport.coverage.kinds).toEqual({ rock: 4, 'non-rock': 1 });

    expect(mockReport.nonRockFalsePositiveRate).toBe(1);
    expect(onDeviceReport.nonRockFalsePositiveRate).toBe(0);

    expect(onDeviceReport.lowConfidenceRate).toBeGreaterThanOrEqual(0.2);
    expect(onDeviceReport.confusionPairs).toEqual(expect.any(Array));
  });
});

function oneHot(dimension: number, index: number): number[] {
  return Array.from({ length: dimension }, (_, position) => (position === index ? 1 : 0));
}


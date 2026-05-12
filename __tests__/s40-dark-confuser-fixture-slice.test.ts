import { afterEach, describe, expect, it } from 'vitest';

import { sprint40DarkConfuserFixtures } from '@/data/eval/sprint40-dark-confuser-fixtures';
import { analyzeIdentificationSessionWithOnDeviceClipKnnAsync } from '@/lib/on-device-clip-knn-analysis';
import { configureNativeOnDeviceImageEncoder, __resetOnDeviceImageEncoderConfigForTesting } from '@/lib/on-device-image-encoder-registry';
import { evaluateRockIdentifierAsync } from '@/lib/rock-id-eval';

describe('S40 dark-confuser fixture slice', () => {
  afterEach(() => {
    __resetOnDeviceImageEncoderConfigForTesting();
  });

  it('adds the selected Basalt vs Slag / Asphalt / Coal boundary without analyzer changes', async () => {
    configureNativeOnDeviceImageEncoder({
      encode: async (photoUri) => {
        if (photoUri.includes('basalt-vesicular-low-margin')) return [0, 0.75, 0.73, 0, 0, 0, 0, 0];
        if (photoUri.includes('slag-rusty-vesicular')) return oneHot(8, 2);
        if (photoUri.includes('asphalt-wet-aggregate')) return oneHot(8, 5);
        if (photoUri.includes('coal-dull-fractured')) return oneHot(8, 6);

        return Array.from({ length: 8 }, () => 1);
      },
    });

    const report = await evaluateRockIdentifierAsync({
      fixtures: sprint40DarkConfuserFixtures,
      analyze: async (session) => analyzeIdentificationSessionWithOnDeviceClipKnnAsync(session),
    });

    expect(report.coverage.kinds).toEqual({ rock: 1, 'non-rock': 3 });
    expect(report.coverage.classes).toEqual({
      Asphalt: 1,
      Basalt: 1,
      Coal: 1,
      Slag: 1,
    });
    expect(report.nonRockFalsePositiveRate).toBe(0);
    expect(report.top1Accuracy).toBe(1);
    expect(report.top3Accuracy).toBe(1);
    expect(report.lowConfidenceSampleIds).toContain('s40-rock-basalt-vesicular-low-margin-a');
  });
});

function oneHot(dimension: number, index: number): number[] {
  return Array.from({ length: dimension }, (_, i) => (i === index ? 1 : 0));
}

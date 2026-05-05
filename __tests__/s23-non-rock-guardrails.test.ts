import { afterEach, describe, expect, it } from 'vitest';

import { analyzeIdentificationSessionWithOnDeviceClipKnnAsync } from '@/lib/on-device-clip-knn-analysis';
import { configureNativeOnDeviceImageEncoder, __resetOnDeviceImageEncoderConfigForTesting } from '@/lib/on-device-image-encoder-registry';

describe('S23 non-rock guardrails', () => {
  afterEach(() => {
    __resetOnDeviceImageEncoderConfigForTesting();
  });

  it('avoids high-confidence natural-rock copy when the top match is a non-rock look-alike', async () => {
    configureNativeOnDeviceImageEncoder({
      encode: async () => oneHot(8, 2),
    });

    const analysis = await analyzeIdentificationSessionWithOnDeviceClipKnnAsync({
      id: 's23-non-rock',
      selectedPhoto: { source: 'upload', uri: 'https://example.com/eval/non-rock-slag.jpg' },
      observations: { color: '', grainSize: '', features: [], notes: '' },
      createdAt: 1,
      updatedAt: 1,
      analysisMode: 'photo',
    });

    expect(analysis.topMatch.category).toBe('Non-rock look-alike');
    expect(analysis.topMatch.confidence).not.toBe('High');
    expect(analysis.reasoning.toLowerCase()).toContain('non-rock');
  });
});

function oneHot(dimension: number, index: number): number[] {
  return Array.from({ length: dimension }, (_, position) => (position === index ? 1 : 0));
}


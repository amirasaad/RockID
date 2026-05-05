import { afterEach, describe, expect, it } from 'vitest';

import { analyzeIdentificationSessionWithOnDeviceClipKnnAsync } from '@/lib/on-device-clip-knn-analysis';
import { configureNativeOnDeviceImageEncoder, __resetOnDeviceImageEncoderConfigForTesting } from '@/lib/on-device-image-encoder-registry';

describe('S24 non-rock multi guardrails', () => {
  afterEach(() => {
    __resetOnDeviceImageEncoderConfigForTesting();
  });

  it('avoids High confidence when the top match is any non-rock look-alike', async () => {
    const cases = [
      { label: 'Slag', uri: 'https://example.com/eval/non-rock-slag.jpg', index: 2 },
      { label: 'Glass', uri: 'https://example.com/eval/non-rock-glass.jpg', index: 4 },
      { label: 'Asphalt', uri: 'https://example.com/eval/non-rock-asphalt.jpg', index: 5 },
      { label: 'Coal', uri: 'https://example.com/eval/non-rock-coal.jpg', index: 6 },
    ] as const;

    for (const testCase of cases) {
      configureNativeOnDeviceImageEncoder({
        encode: async () => oneHot(8, testCase.index),
      });

      const analysis = await analyzeIdentificationSessionWithOnDeviceClipKnnAsync({
        id: `s24-non-rock-${testCase.label.toLowerCase()}`,
        selectedPhoto: { source: 'upload', uri: testCase.uri },
        observations: { color: '', grainSize: '', features: [], notes: '' },
        createdAt: 1,
        updatedAt: 1,
        analysisMode: 'photo',
      });

      expect(analysis.topMatch.category).toBe('Non-rock look-alike');
      expect(analysis.topMatch.name).toBe(testCase.label);
      expect(analysis.topMatch.confidence).not.toBe('High');
      expect(analysis.reasoning.toLowerCase()).toContain('non-rock');
    }
  });
});

function oneHot(dimension: number, index: number): number[] {
  return Array.from({ length: dimension }, (_, position) => (position === index ? 1 : 0));
}

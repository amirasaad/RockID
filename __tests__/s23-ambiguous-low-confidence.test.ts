import { afterEach, describe, expect, it } from 'vitest';

import { analyzeIdentificationSessionWithOnDeviceClipKnnAsync } from '@/lib/on-device-clip-knn-analysis';
import { configureNativeOnDeviceImageEncoder, __resetOnDeviceImageEncoderConfigForTesting } from '@/lib/on-device-image-encoder-registry';

describe('S23 ambiguous confidence', () => {
  afterEach(() => {
    __resetOnDeviceImageEncoderConfigForTesting();
  });

  it('returns low confidence with next-step guidance for ambiguous photo evidence', async () => {
    configureNativeOnDeviceImageEncoder({
      encode: async () => Array.from({ length: 8 }, () => 1),
    });

    const analysis = await analyzeIdentificationSessionWithOnDeviceClipKnnAsync({
      id: 's23-ambiguous',
      selectedPhoto: { source: 'upload', uri: 'https://example.com/eval/ambiguous.jpg' },
      observations: { color: '', grainSize: '', features: [], notes: '' },
      createdAt: 1,
      updatedAt: 1,
      analysisMode: 'photo',
    });

    expect(analysis.topMatch.confidence).toBe('Low');
    expect(analysis.nextCheck.toLowerCase()).toContain('try again');
  });
});


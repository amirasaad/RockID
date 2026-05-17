import { afterEach, describe, expect, it } from 'vitest';

import { sprint41DarkBoundaryLabeledPack } from '@/data/eval/sprint41-dark-boundary-labeled-pack';
import { analyzeIdentificationSessionWithOnDeviceClipKnnAsync } from '@/lib/on-device-clip-knn-analysis';
import { configureNativeOnDeviceImageEncoder, __resetOnDeviceImageEncoderConfigForTesting } from '@/lib/on-device-image-encoder-registry';
import { evaluateRockIdentifierAsync } from '@/lib/rock-id-eval';

describe('S42 production index decision', () => {
  afterEach(() => {
    __resetOnDeviceImageEncoderConfigForTesting();
  });

  it('promotes one Basalt support index item without regressing the S41 dark-boundary pack', async () => {
    configureSprint42BoundaryEmbeddings();

    const fixtures = sprint41DarkBoundaryLabeledPack.map((sample) => sample.fixture);
    const report = await evaluateRockIdentifierAsync({
      fixtures,
      analyze: async (session) => analyzeIdentificationSessionWithOnDeviceClipKnnAsync(session),
    });

    expect(report.coverage.kinds).toEqual({ rock: 3, 'non-rock': 3 });
    expect(report.top1Accuracy).toBe(1);
    expect(report.top3Accuracy).toBe(1);
    expect(report.nonRockFalsePositiveRate).toBe(0);
    expect(report.perClassAccuracy.Basalt).toEqual({ total: 3, top1Accuracy: 1, top3Accuracy: 1 });
    expect(report.perClassAccuracy.Slag).toEqual({ total: 1, top1Accuracy: 1, top3Accuracy: 1 });
  });

  it('keeps known non-rock guards from becoming high-confidence rock claims', async () => {
    configureSprint42BoundaryEmbeddings();

    const nonRockFixtures = sprint41DarkBoundaryLabeledPack
      .filter((sample) => sample.expectedKind === 'non-rock')
      .map((sample) => sample.fixture);

    for (const fixture of nonRockFixtures) {
      const analysis = await analyzeIdentificationSessionWithOnDeviceClipKnnAsync(fixture.session);

      expect(analysis.matches.slice(0, 3).map((match) => match.name)).toContain(fixture.expectedLabel);
      expect(analysis.topMatch.name).toBe(fixture.expectedLabel);
      expect(analysis.topMatch.category).toBe('Non-rock look-alike');
      expect(analysis.topMatch.confidence).not.toBe('High');
    }
  });
});

function configureSprint42BoundaryEmbeddings(): void {
  configureNativeOnDeviceImageEncoder({
    encode: async (photoUri) => {
      if (photoUri.includes('basalt-vesicular-shade')) return [0, 0.75, 0.73, 0, 0, 0, 0, 0];
      if (photoUri.includes('slag-rusty-vesicular')) return [0, 0.65, 0.76, 0, 0, 0, 0, 0];
      if (photoUri.includes('basalt-fresh-break')) return [0, 0.95, 0.05, 0, 0, 0, 0, 0];
      if (photoUri.includes('asphalt-wet-aggregate')) return [0, 0, 0, 0, 0, 1, 0, 0];
      if (photoUri.includes('basalt-dull-massive')) return [0, 0.9, 0.1, 0, 0, 0, 0, 0];
      if (photoUri.includes('coal-dull-fractured')) return [0, 0, 0, 0, 0, 0, 1, 0];

      return Array.from({ length: 8 }, () => 1);
    },
  });
}

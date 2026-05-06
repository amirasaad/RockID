import { afterEach, describe, expect, it } from 'vitest';

import { fieldQaEvalFixtures } from '@/data/eval/field-qa-fixtures';
import { analyzeIdentificationSessionWithOnDeviceClipKnnAsync } from '@/lib/on-device-clip-knn-analysis';
import { configureNativeOnDeviceImageEncoder, __resetOnDeviceImageEncoderConfigForTesting } from '@/lib/on-device-image-encoder-registry';
import { evaluateRockIdentifierAsync, formatRockIdEvalSummary } from '@/lib/rock-id-eval';

describe('S26 confidence calibration', () => {
  afterEach(() => {
    __resetOnDeviceImageEncoderConfigForTesting();
  });

  it('calibrates confidence thresholds to maximize rock accuracy while keeping non-rock safety', async () => {
    configureNativeOnDeviceImageEncoder({
      encode: async (photoUri) => {
        if (photoUri.includes('field-rock-granite-a')) return oneHot(8, 0);
        if (photoUri.includes('field-rock-granite-poor-light')) return oneHot(8, 0);
        if (photoUri.includes('field-rock-basalt-a')) return oneHot(8, 1);
        if (photoUri.includes('field-rock-basalt-partial-frame')) return oneHot(8, 1);
        if (photoUri.includes('field-rock-ambiguous-a')) return lowConfidenceGraniteBias(8);
        if (photoUri.includes('field-rock-obsidian-blurry')) return mediumConfidenceObsidian(8);
        if (photoUri.includes('field-rock-mixed-materials')) return lowConfidenceGraniteBias(8);
        if (photoUri.includes('field-non-rock-slag')) return oneHot(8, 2);
        if (photoUri.includes('field-non-rock-glass')) return oneHot(8, 4);
        if (photoUri.includes('field-non-rock-asphalt')) return oneHot(8, 5);
        if (photoUri.includes('field-non-rock-coal')) return oneHot(8, 6);
        if (photoUri.includes('field-non-rock-concrete')) return [0, 0, 1, 0, 0, 0.5, 0, 0];
        if (photoUri.includes('field-non-rock-brick')) return [0, 0, 0, 0, 1, 0, 0.5, 0];
        if (photoUri.includes('field-non-rock-plastic')) return [0, 0, 0, 0, 0, 1, 0, 0.5];
        return Array.from({ length: 8 }, () => 1);
      },
    });

    const report = await evaluateRockIdentifierAsync({
      fixtures: fieldQaEvalFixtures,
      analyze: async (session) => analyzeIdentificationSessionWithOnDeviceClipKnnAsync(session),
    });

    expect(report.total).toBe(14);
    expect(report.coverage.kinds).toEqual({ rock: 7, 'non-rock': 7 });

    expect(report.nonRockFalsePositiveRate).toBe(0);
    expect(report.nonRockConfusions).toEqual([]);

    expect(report.top1Accuracy).toBeGreaterThanOrEqual(0.7);
    expect(report.top3Accuracy).toBeGreaterThanOrEqual(0.9);

    expect(report.lowConfidenceRate).toBeGreaterThan(0);
    expect(report.lowConfidenceSampleIds.length).toBeGreaterThanOrEqual(2);

    const summary = formatRockIdEvalSummary(report);
    expect(summary).toContain('Total: 14');
    expect(summary).toContain('Coverage kinds: rock=7, non-rock=7');
    expect(summary).toContain('Non-rock false positives: 0.0%');
    expect(summary).toContain('Non-rock confusions:\n- None');
  });

  it('tracks confidence distribution across edge cases', async () => {
    configureNativeOnDeviceImageEncoder({
      encode: async (photoUri) => {
        if (photoUri.includes('field-rock-granite-a')) return oneHot(8, 0);
        if (photoUri.includes('field-rock-basalt-a')) return oneHot(8, 1);
        if (photoUri.includes('field-rock-ambiguous')) return lowConfidenceGraniteBias(8);
        if (photoUri.includes('field-rock-obsidian-blurry')) return mediumConfidenceObsidian(8);
        if (photoUri.includes('field-rock-mixed-materials')) return lowConfidenceGraniteBias(8);
        if (photoUri.includes('field-non-rock')) return oneHot(8, 2);
        return Array.from({ length: 8 }, () => 1);
      },
    });

    const analyses = await Promise.all(
      fieldQaEvalFixtures
        .filter((f) => f.id.includes('edge') || f.id.includes('ambiguous') || f.id.includes('blurry') || f.id.includes('mixed') || f.id.includes('poor') || f.id.includes('partial'))
        .map(async (fixture) => ({
          id: fixture.id,
          confidence: (await analyzeIdentificationSessionWithOnDeviceClipKnnAsync(fixture.session)).topMatch.confidence,
        }))
    );

    const lowConfidenceCount = analyses.filter((a) => a.confidence === 'Low').length;
    const mediumConfidenceCount = analyses.filter((a) => a.confidence === 'Medium').length;

    expect(lowConfidenceCount + mediumConfidenceCount).toBeGreaterThanOrEqual(3);
  });
});

function oneHot(dimension: number, index: number): number[] {
  return Array.from({ length: dimension }, (_, i) => (i === index ? 1 : 0));
}

function lowConfidenceGraniteBias(dimension: number): number[] {
  return Array.from({ length: dimension }, (_, i) => {
    if (i === 0) return 1;
    if (i === 1) return 0.99;
    return 0;
  });
}

function mediumConfidenceObsidian(dimension: number): number[] {
  return Array.from({ length: dimension }, (_, i) => (i === 3 ? 0.75 : i === 0 ? 0.5 : 0.1));
}

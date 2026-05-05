import { afterEach, describe, expect, it } from 'vitest';

import { fieldQaEvalFixtures } from '@/data/eval/field-qa-fixtures';
import { analyzeIdentificationSessionWithOnDeviceClipKnnAsync } from '@/lib/on-device-clip-knn-analysis';
import { configureNativeOnDeviceImageEncoder, __resetOnDeviceImageEncoderConfigForTesting } from '@/lib/on-device-image-encoder-registry';
import { evaluateRockIdentifierAsync, formatRockIdEvalSummary } from '@/lib/rock-id-eval';

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
    expect(report.lowConfidenceSampleIds).toEqual(['field-rock-ambiguous-a']);

    const summary = formatRockIdEvalSummary(report);
    expect(summary).toContain('Total: 7');
    expect(summary).toContain('Coverage kinds: rock=3, non-rock=4');
    expect(summary).toContain('Coverage classes: Asphalt=1, Basalt=1, Coal=1, Glass=1, Granite=2, Slag=1');
    expect(summary).toContain('Top-1: 100.0%');
    expect(summary).toContain('Top-3: 100.0%');
    expect(summary).toContain('Low confidence: 14.3%');
    expect(summary).toContain('Low-confidence samples: field-rock-ambiguous-a');
    expect(summary).toContain('Non-rock false positives: 0.0%');
    expect(summary).toContain('Top confusions:\n- None');
    expect(summary).toContain('Non-rock confusions:\n- None');

    const analyses = await Promise.all(
      fieldQaEvalFixtures.map(async (fixture) => ({
        fixture,
        analysis: await analyzeIdentificationSessionWithOnDeviceClipKnnAsync(fixture.session),
      }))
    );
    for (const { fixture, analysis } of analyses) {
      expect(analysis.sessionId).toBe(fixture.session.id);
      const photo = fixture.session.selectedPhoto;
      expect(photo).toBeDefined();
      if (photo) {
        expect(analysis.imageUri).toBe(photo.uri);
      }
    }

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

  it('surfaces top confusions and sample ids in the field QA summary when a regression appears', async () => {
    configureNativeOnDeviceImageEncoder({
      encode: async (photoUri) => {
        if (photoUri.includes('field-rock-granite')) return oneHot(8, 0);
        if (photoUri.includes('field-rock-basalt')) return oneHot(8, 1);
        if (photoUri.includes('field-rock-ambiguous')) return lowConfidenceGraniteBias(8);
        if (photoUri.includes('field-non-rock-slag')) return oneHot(8, 2);
        if (photoUri.includes('field-non-rock-glass')) return oneHot(8, 4);
        if (photoUri.includes('field-non-rock-asphalt')) return oneHot(8, 5);
        if (photoUri.includes('field-non-rock-coal')) return oneHot(8, 0);
        return Array.from({ length: 8 }, () => 1);
      },
    });

    const report = await evaluateRockIdentifierAsync({
      fixtures: fieldQaEvalFixtures,
      analyze: async (session) => analyzeIdentificationSessionWithOnDeviceClipKnnAsync(session),
    });

    expect(report.nonRockFalsePositiveRate).toBeCloseTo(0.25, 6);
    expect(report.nonRockConfusions).toContainEqual({
      expected: 'Coal',
      predicted: 'Granite',
      count: 1,
      sampleIds: ['field-non-rock-coal-a'],
    });

    const summary = formatRockIdEvalSummary(report);
    expect(summary).toContain('Non-rock false positives: 25.0%');
    expect(summary).toContain('Coal → Granite (1) [field-non-rock-coal-a]');
    expect(summary).toContain('Non-rock confusions:');
  });
});

function oneHot(dimension: number, index: number): number[] {
  return Array.from({ length: dimension }, (_, i) => (i === index ? 1 : 0));
}

function lowConfidenceGraniteBias(dimension: number): number[] {
  return Array.from({ length: dimension }, (_, i) => (i === 0 ? 1.01 : 1));
}

import { afterEach, describe, expect, it } from 'vitest';

import { fieldQaEvalFixtures } from '@/data/eval/field-qa-fixtures';
import { analyzeIdentificationSessionWithOnDeviceClipKnnAsync } from '@/lib/on-device-clip-knn-analysis';
import { configureNativeOnDeviceImageEncoder, __resetOnDeviceImageEncoderConfigForTesting } from '@/lib/on-device-image-encoder-registry';
import { evaluateRockIdentifierAsync } from '@/lib/rock-id-eval';

describe('S26 non-rock detection hardening', () => {
  afterEach(() => {
    __resetOnDeviceImageEncoderConfigForTesting();
  });

  it('has zero high-confidence non-rock mistakes on expanded fixture set', async () => {
    configureNativeOnDeviceImageEncoder({
      encode: async (photoUri) => {
        if (photoUri.includes('field-rock-granite')) return oneHot(8, 0);
        if (photoUri.includes('field-rock-basalt')) return oneHot(8, 1);
        if (photoUri.includes('field-rock-obsidian')) return oneHot(8, 3);
        if (photoUri.includes('field-rock-ambiguous')) return lowConfidenceGraniteBias(8);
        if (photoUri.includes('field-rock-mixed-materials')) return lowConfidenceGraniteBias(8);
        if (photoUri.includes('field-non-rock-slag')) return oneHot(8, 2);
        if (photoUri.includes('field-non-rock-glass')) return oneHot(8, 4);
        if (photoUri.includes('field-non-rock-asphalt')) return oneHot(8, 5);
        if (photoUri.includes('field-non-rock-coal')) return oneHot(8, 6);
        if (photoUri.includes('field-non-rock-concrete')) return concreteEmbedding();
        if (photoUri.includes('field-non-rock-brick')) return brickEmbedding();
        if (photoUri.includes('field-non-rock-plastic')) return plasticEmbedding();
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

    const nonRockResults = await Promise.all(
      fieldQaEvalFixtures
        .filter((f) => f.expectedKind === 'non-rock')
        .map(async (fixture) => ({
          id: fixture.id,
          analysis: await analyzeIdentificationSessionWithOnDeviceClipKnnAsync(fixture.session),
        }))
    );

    for (const result of nonRockResults) {
      expect(result.analysis.topMatch.confidence).not.toBe('High');
    }

    const highConfidenceNonRocks = nonRockResults.filter(
      (r) => r.analysis.topMatch.confidence === 'High'
    );
    expect(highConfidenceNonRocks).toEqual([]);
  });

  it('detects non-rock confusers including new types (concrete, brick, plastic)', async () => {
    configureNativeOnDeviceImageEncoder({
      encode: async (photoUri) => {
        if (photoUri.includes('field-non-rock-concrete')) return oneHot(8, 2);
        if (photoUri.includes('field-non-rock-brick')) return oneHot(8, 4);
        if (photoUri.includes('field-non-rock-plastic')) return oneHot(8, 5);
        if (photoUri.includes('field-non-rock')) return oneHot(8, 2);
        return oneHot(8, 0);
      },
    });

    const newConfusers = fieldQaEvalFixtures.filter(
      (f) => f.id.includes('concrete') || f.id.includes('brick') || f.id.includes('plastic')
    );

    expect(newConfusers.length).toBe(3);

    const results = await Promise.all(
      newConfusers.map(async (fixture) => ({
        id: fixture.id,
        analysis: await analyzeIdentificationSessionWithOnDeviceClipKnnAsync(fixture.session),
      }))
    );

    for (const result of results) {
      expect(result.analysis.topMatch.category).toBe('Non-rock look-alike');
      expect(result.analysis.reasoning).toContain('non-rock');
    }
  });

  it('regression: fails if non-rock false positive rate increases', async () => {
    configureNativeOnDeviceImageEncoder({
      encode: async (photoUri) => {
        if (photoUri.includes('field-rock')) return oneHot(8, 0);
        if (photoUri.includes('field-non-rock-coal')) return oneHot(8, 0);
        if (photoUri.includes('field-non-rock-concrete')) return oneHot(8, 0);
        if (photoUri.includes('field-non-rock-brick')) return oneHot(8, 0);
        if (photoUri.includes('field-non-rock-plastic')) return oneHot(8, 0);
        return oneHot(8, 2);
      },
    });

    const report = await evaluateRockIdentifierAsync({
      fixtures: fieldQaEvalFixtures,
      analyze: async (session) => analyzeIdentificationSessionWithOnDeviceClipKnnAsync(session),
    });

    expect(report.nonRockFalsePositiveRate).toBeGreaterThan(0);
    expect(report.nonRockConfusions.length).toBeGreaterThan(0);

    const hasCoalGraniteConfusion = report.nonRockConfusions.some(
      (c) => c.expected === 'Coal' && c.predicted === 'Granite'
    );
    expect(hasCoalGraniteConfusion).toBe(true);
  });
});

function oneHot(dimension: number, index: number): number[] {
  return Array.from({ length: dimension }, (_, i) => (i === index ? 1 : 0));
}

function lowConfidenceGraniteBias(dimension: number): number[] {
  return Array.from({ length: dimension }, (_, i) => (i === 0 ? 1.01 : 1));
}

function concreteEmbedding(): number[] {
  return [0, 0, 1, 0, 0, 0.5, 0, 0];
}

function brickEmbedding(): number[] {
  return [0, 0, 0, 0, 1, 0, 0.5, 0];
}

function plasticEmbedding(): number[] {
  return [0, 0, 0, 0, 0, 1, 0, 0.5];
}

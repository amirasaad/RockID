import { afterEach, describe, expect, it } from 'vitest';

import { sprint32NonRockGateFixtures } from '@/data/eval/sprint32-non-rock-gate-fixtures';
import { sprint37EvidenceFixtures } from '@/data/eval/sprint37-evidence-fixtures';
import { evaluateDetectionQualityGates } from '@/lib/rock-id-detection-gates';
import { analyzeIdentificationSessionWithOnDeviceClipKnnAsync } from '@/lib/on-device-clip-knn-analysis';
import { configureNativeOnDeviceImageEncoder, __resetOnDeviceImageEncoderConfigForTesting } from '@/lib/on-device-image-encoder-registry';
import { evaluateRockIdentifierAsync } from '@/lib/rock-id-eval';

// Sprint 34 baseline — regression tolerance per S37-2.
const SPRINT_34_BASELINE = { top1Accuracy: 0.76, top3Accuracy: 0.92 };

describe('S37 evidence-based detection hardening acceptance', () => {
  afterEach(() => {
    __resetOnDeviceImageEncoderConfigForTesting();
  });

  it('passes combined S32+S37 detection gates within Sprint 34 regression tolerance', async () => {
    configureNativeOnDeviceImageEncoder({
      encode: async (photoUri) => {
        // S37 fixtures — checked before S32 patterns to avoid substring overlap.
        if (photoUri.includes('basalt-dark-vesicular')) return [0, 0.75, 0.73, 0, 0, 0, 0, 0];
        if (photoUri.includes('sandstone-layered')) return oneHot(8, 7);
        if (photoUri.includes('asphalt-rough')) return oneHot(8, 5);
        if (photoUri.includes('coal-shiny')) return oneHot(8, 6);

        // S32 fixtures.
        if (photoUri.includes('rock-granite')) return oneHot(8, 0);
        if (photoUri.includes('rock-basalt')) return oneHot(8, 1);
        if (photoUri.includes('rock-ambiguous')) return lowConfidenceGraniteBias(8);
        if (photoUri.includes('non-rock-slag')) return oneHot(8, 2);
        if (photoUri.includes('non-rock-glass')) return oneHot(8, 4);
        if (photoUri.includes('non-rock-concrete')) return concreteEmbedding();
        if (photoUri.includes('non-rock-brick')) return brickEmbedding();
        if (photoUri.includes('non-rock-plastic')) return plasticEmbedding();

        return Array.from({ length: 8 }, () => 1);
      },
    });

    const fixtures = [...sprint32NonRockGateFixtures, ...sprint37EvidenceFixtures];

    const report = await evaluateRockIdentifierAsync({
      fixtures,
      analyze: async (session) => analyzeIdentificationSessionWithOnDeviceClipKnnAsync(session),
    });

    const gate = evaluateDetectionQualityGates({
      report,
      baseline: SPRINT_34_BASELINE,
      thresholds: {
        maxNonRockFalsePositiveRate: 0,
        minLowConfidenceRate: 0.1,
        maxTop1Regression: 0.03,
        maxTop3Regression: 0.02,
        minTopConfusionCount: 1,
      },
    });

    // S37-1: fixture coverage expands to include S37 evidence slice.
    expect(report.coverage.kinds).toEqual({ rock: 5, 'non-rock': 9 });

    // S37-2: regression stays within Sprint 34 tolerance.
    expect(report.top1Accuracy).toBeGreaterThanOrEqual(SPRINT_34_BASELINE.top1Accuracy - 0.03);
    expect(report.top3Accuracy).toBeGreaterThanOrEqual(SPRINT_34_BASELINE.top3Accuracy - 0.02);

    // S37-3: non-rock false-positive and low-confidence gates stay green.
    expect(report.nonRockFalsePositiveRate).toBe(0);
    expect(report.lowConfidenceRate).toBeGreaterThanOrEqual(0.1);
    expect(gate.passed).toBe(true);
    expect(gate.checks.find((c) => c.name === 'nonRockFalsePositiveRate')?.passed).toBe(true);
    expect(gate.checks.find((c) => c.name === 'lowConfidenceRate')?.passed).toBe(true);

    // S37-4: top confusion is visible for next sprint targeting.
    expect(gate.topConfusions.length).toBeGreaterThanOrEqual(1);
  });

  it('shows basalt-dark-vesicular fixture triggers non-rock proximity downgrade to Low confidence', async () => {
    configureNativeOnDeviceImageEncoder({
      encode: async (photoUri) => {
        if (photoUri.includes('basalt-dark-vesicular')) return [0, 0.75, 0.73, 0, 0, 0, 0, 0];
        if (photoUri.includes('sandstone-layered')) return oneHot(8, 7);
        if (photoUri.includes('asphalt-rough')) return oneHot(8, 5);
        if (photoUri.includes('coal-shiny')) return oneHot(8, 6);
        return Array.from({ length: 8 }, () => 1);
      },
    });

    const report = await evaluateRockIdentifierAsync({
      fixtures: sprint37EvidenceFixtures,
      analyze: async (session) => analyzeIdentificationSessionWithOnDeviceClipKnnAsync(session),
    });

    const vesicularResult = report.lowConfidenceSampleIds.find((id) => id.includes('basalt-dark-vesicular'));
    expect(vesicularResult).toBeDefined();

    // All S37 fixtures identify correctly despite boundary proximity.
    expect(report.top1Accuracy).toBe(1);
    expect(report.nonRockFalsePositiveRate).toBe(0);
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

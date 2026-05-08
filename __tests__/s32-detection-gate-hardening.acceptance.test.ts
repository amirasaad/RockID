import { afterEach, describe, expect, it } from 'vitest';

import { sprint32NonRockGateFixtures } from '@/data/eval/sprint32-non-rock-gate-fixtures';
import { evaluateDetectionQualityGates } from '@/lib/rock-id-detection-gates';
import { analyzeIdentificationSessionWithOnDeviceClipKnnAsync } from '@/lib/on-device-clip-knn-analysis';
import { configureNativeOnDeviceImageEncoder, __resetOnDeviceImageEncoderConfigForTesting } from '@/lib/on-device-image-encoder-registry';
import { evaluateRockIdentifierAsync } from '@/lib/rock-id-eval';

describe('S32 non-rock gate hardening acceptance', () => {
  afterEach(() => {
    __resetOnDeviceImageEncoderConfigForTesting();
  });

  it('passes conservative detection gates with expanded non-rock confusers', async () => {
    configureNativeOnDeviceImageEncoder({
      encode: async (photoUri) => {
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

    const report = await evaluateRockIdentifierAsync({
      fixtures: sprint32NonRockGateFixtures,
      analyze: async (session) => analyzeIdentificationSessionWithOnDeviceClipKnnAsync(session),
    });

    const gate = evaluateDetectionQualityGates({
      report,
      thresholds: {
        maxNonRockFalsePositiveRate: 0,
        minLowConfidenceRate: 0.1,
        minTopConfusionCount: 1,
      },
    });

    expect(report.coverage.kinds).toEqual({ rock: 3, 'non-rock': 7 });
    expect(report.nonRockFalsePositiveRate).toBe(0);
    expect(gate.passed).toBe(true);
    expect(gate.checks.find((check) => check.name === 'nonRockFalsePositiveRate')?.passed).toBe(true);
    expect(gate.checks.find((check) => check.name === 'lowConfidenceRate')?.passed).toBe(true);
    expect(gate.topConfusions.length).toBeGreaterThanOrEqual(1);
  });

  it('fails gates when non-rock false positives and regression exceed limits', async () => {
    configureNativeOnDeviceImageEncoder({
      encode: async (photoUri) => {
        if (photoUri.includes('rock-granite')) return oneHot(8, 0);
        if (photoUri.includes('rock-basalt')) return oneHot(8, 1);
        if (photoUri.includes('rock-ambiguous')) return lowConfidenceGraniteBias(8);

        if (photoUri.includes('non-rock')) return oneHot(8, 0);
        return Array.from({ length: 8 }, () => 1);
      },
    });

    const report = await evaluateRockIdentifierAsync({
      fixtures: sprint32NonRockGateFixtures,
      analyze: async (session) => analyzeIdentificationSessionWithOnDeviceClipKnnAsync(session),
    });

    const baseline = {
      top1Accuracy: 0.8,
      top3Accuracy: 0.95,
    };

    const gate = evaluateDetectionQualityGates({
      report,
      baseline,
      thresholds: {
        maxNonRockFalsePositiveRate: 0.15,
        maxTop1Regression: 0.03,
        maxTop3Regression: 0.02,
      },
    });

    expect(report.nonRockFalsePositiveRate).toBeGreaterThan(0.15);
    expect(gate.passed).toBe(false);
    expect(gate.checks.find((check) => check.name === 'nonRockFalsePositiveRate')?.passed).toBe(false);
    expect(gate.checks.find((check) => check.name === 'top1NoRegression')?.passed).toBe(false);
    expect(gate.checks.find((check) => check.name === 'top3NoRegression')?.passed).toBe(false);
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

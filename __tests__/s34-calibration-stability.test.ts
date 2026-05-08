import { describe, expect, it } from 'vitest';

import { evaluateCalibrationStability } from '@/lib/detection-calibration-stability';

describe('S34 calibration stability', () => {
  it('passes when current metrics remain within conservative Sprint 32 tolerances', () => {
    const report = evaluateCalibrationStability({
      baseline: {
        top1Accuracy: 0.76,
        top3Accuracy: 0.92,
        nonRockFalsePositiveRate: 0.1,
        lowConfidenceRate: 0.2,
      },
      current: {
        top1Accuracy: 0.74,
        top3Accuracy: 0.91,
        nonRockFalsePositiveRate: 0.12,
        lowConfidenceRate: 0.18,
      },
    });

    expect(report.passed).toBe(true);
    expect(report.checks.every((check) => check.passed)).toBe(true);
  });

  it('fails when top accuracy drops, non-rock false positives rise, and confidence floor collapses', () => {
    const report = evaluateCalibrationStability({
      baseline: {
        top1Accuracy: 0.78,
        top3Accuracy: 0.94,
        nonRockFalsePositiveRate: 0.06,
        lowConfidenceRate: 0.2,
      },
      current: {
        top1Accuracy: 0.72,
        top3Accuracy: 0.89,
        nonRockFalsePositiveRate: 0.14,
        lowConfidenceRate: 0.04,
      },
    });

    expect(report.passed).toBe(false);
    expect(report.checks.find((check) => check.name === 'top1Stable')?.passed).toBe(false);
    expect(report.checks.find((check) => check.name === 'top3Stable')?.passed).toBe(false);
    expect(report.checks.find((check) => check.name === 'nonRockFalsePositiveStable')?.passed).toBe(false);
    expect(report.checks.find((check) => check.name === 'lowConfidenceFloorStable')?.passed).toBe(false);
  });
});

import type { RockIdEvalReport } from './rock-id-eval';

export type CalibrationStabilityThresholds = {
  maxTop1Drop: number;
  maxTop3Drop: number;
  maxNonRockFalsePositiveRateIncrease: number;
  minLowConfidenceRateFloor: number;
};

export type CalibrationStabilityCheck = {
  name:
    | 'top1Stable'
    | 'top3Stable'
    | 'nonRockFalsePositiveStable'
    | 'lowConfidenceFloorStable';
  passed: boolean;
  actual: number;
  expected: number;
};

export type CalibrationStabilityReport = {
  passed: boolean;
  checks: CalibrationStabilityCheck[];
};

export const DEFAULT_CALIBRATION_STABILITY_THRESHOLDS: CalibrationStabilityThresholds = {
  maxTop1Drop: 0.03,
  maxTop3Drop: 0.02,
  maxNonRockFalsePositiveRateIncrease: 0.05,
  minLowConfidenceRateFloor: 0.1,
};

export function evaluateCalibrationStability(input: {
  baseline: Pick<RockIdEvalReport, 'top1Accuracy' | 'top3Accuracy' | 'nonRockFalsePositiveRate' | 'lowConfidenceRate'>;
  current: Pick<RockIdEvalReport, 'top1Accuracy' | 'top3Accuracy' | 'nonRockFalsePositiveRate' | 'lowConfidenceRate'>;
  thresholds?: Partial<CalibrationStabilityThresholds>;
}): CalibrationStabilityReport {
  const thresholds: CalibrationStabilityThresholds = {
    ...DEFAULT_CALIBRATION_STABILITY_THRESHOLDS,
    ...input.thresholds,
  };

  const top1Drop = Math.max(0, input.baseline.top1Accuracy - input.current.top1Accuracy);
  const top3Drop = Math.max(0, input.baseline.top3Accuracy - input.current.top3Accuracy);
  const nonRockIncrease = Math.max(0, input.current.nonRockFalsePositiveRate - input.baseline.nonRockFalsePositiveRate);
  const lowConfidence = input.current.lowConfidenceRate;

  const checks: CalibrationStabilityCheck[] = [
    {
      name: 'top1Stable',
      passed: top1Drop <= thresholds.maxTop1Drop,
      actual: top1Drop,
      expected: thresholds.maxTop1Drop,
    },
    {
      name: 'top3Stable',
      passed: top3Drop <= thresholds.maxTop3Drop,
      actual: top3Drop,
      expected: thresholds.maxTop3Drop,
    },
    {
      name: 'nonRockFalsePositiveStable',
      passed: nonRockIncrease <= thresholds.maxNonRockFalsePositiveRateIncrease,
      actual: nonRockIncrease,
      expected: thresholds.maxNonRockFalsePositiveRateIncrease,
    },
    {
      name: 'lowConfidenceFloorStable',
      passed: lowConfidence >= thresholds.minLowConfidenceRateFloor,
      actual: lowConfidence,
      expected: thresholds.minLowConfidenceRateFloor,
    },
  ];

  return {
    passed: checks.every((check) => check.passed),
    checks,
  };
}

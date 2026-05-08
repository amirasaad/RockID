import type { RockIdConfusionPair, RockIdEvalReport } from './rock-id-eval';

export type DetectionGateThresholds = {
  maxNonRockFalsePositiveRate: number;
  minLowConfidenceRate: number;
  maxTop1Regression: number;
  maxTop3Regression: number;
  minTopConfusionCount: number;
};

export type DetectionGateCheck = {
  name:
    | 'nonRockFalsePositiveRate'
    | 'lowConfidenceRate'
    | 'topConfusionsVisible'
    | 'top1NoRegression'
    | 'top3NoRegression';
  passed: boolean;
  actual: number;
  expected: number;
};

export type DetectionGateReport = {
  passed: boolean;
  checks: DetectionGateCheck[];
  topConfusions: RockIdConfusionPair[];
};

export const DEFAULT_DETECTION_GATE_THRESHOLDS: DetectionGateThresholds = {
  maxNonRockFalsePositiveRate: 0.15,
  minLowConfidenceRate: 0.1,
  maxTop1Regression: 0.03,
  maxTop3Regression: 0.02,
  minTopConfusionCount: 1,
};

export function evaluateDetectionQualityGates(input: {
  report: RockIdEvalReport;
  baseline?: Pick<RockIdEvalReport, 'top1Accuracy' | 'top3Accuracy'>;
  thresholds?: Partial<DetectionGateThresholds>;
}): DetectionGateReport {
  const thresholds: DetectionGateThresholds = {
    ...DEFAULT_DETECTION_GATE_THRESHOLDS,
    ...input.thresholds,
  };

  const topConfusions = sortConfusions(input.report.topConfusions.length > 0 ? input.report.topConfusions : input.report.confusionPairs);

  const checks: DetectionGateCheck[] = [
    {
      name: 'nonRockFalsePositiveRate',
      passed: input.report.nonRockFalsePositiveRate <= thresholds.maxNonRockFalsePositiveRate,
      actual: input.report.nonRockFalsePositiveRate,
      expected: thresholds.maxNonRockFalsePositiveRate,
    },
    {
      name: 'lowConfidenceRate',
      passed: input.report.lowConfidenceRate >= thresholds.minLowConfidenceRate,
      actual: input.report.lowConfidenceRate,
      expected: thresholds.minLowConfidenceRate,
    },
    {
      name: 'topConfusionsVisible',
      passed: topConfusions.length >= thresholds.minTopConfusionCount,
      actual: topConfusions.length,
      expected: thresholds.minTopConfusionCount,
    },
  ];

  if (input.baseline) {
    const top1Drop = Math.max(0, input.baseline.top1Accuracy - input.report.top1Accuracy);
    const top3Drop = Math.max(0, input.baseline.top3Accuracy - input.report.top3Accuracy);

    checks.push(
      {
        name: 'top1NoRegression',
        passed: top1Drop <= thresholds.maxTop1Regression,
        actual: top1Drop,
        expected: thresholds.maxTop1Regression,
      },
      {
        name: 'top3NoRegression',
        passed: top3Drop <= thresholds.maxTop3Regression,
        actual: top3Drop,
        expected: thresholds.maxTop3Regression,
      }
    );
  }

  return {
    passed: checks.every((check) => check.passed),
    checks,
    topConfusions,
  };
}

function sortConfusions(confusions: RockIdConfusionPair[]): RockIdConfusionPair[] {
  return [...confusions].sort((left, right) => {
    const byCount = right.count - left.count;
    if (byCount !== 0) return byCount;
    const byExpected = left.expected.localeCompare(right.expected);
    if (byExpected !== 0) return byExpected;
    return left.predicted.localeCompare(right.predicted);
  });
}

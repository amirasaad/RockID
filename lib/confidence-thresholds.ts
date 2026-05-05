export type ConfidenceThresholds = {
  high: {
    minTopScore: number;
    minMargin: number;
  };
  medium: {
    minTopScore: number;
    minMargin: number;
  };
};

export function getDefaultConfidenceThresholds(): ConfidenceThresholds {
  return {
    high: { minTopScore: 0.5, minMargin: 0.15 },
    medium: { minTopScore: 0.35, minMargin: 0.08 },
  };
}

export function getCalibratedConfidenceThresholds(): ConfidenceThresholds {
  return {
    high: { minTopScore: 0.55, minMargin: 0.18 },
    medium: { minTopScore: 0.4, minMargin: 0.1 },
  };
}

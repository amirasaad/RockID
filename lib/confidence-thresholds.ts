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
    high: { minTopScore: 0.45, minMargin: 0.12 },
    medium: { minTopScore: 0.3, minMargin: 0.05 },
  };
}

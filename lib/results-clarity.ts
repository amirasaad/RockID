export type ResultsClarityVariant = 'default' | 'low-confidence';

export function getResultsClarityVariant(confidence: string): ResultsClarityVariant {
  return confidence === 'Low' ? 'low-confidence' : 'default';
}

export function isLowConfidenceVariant(confidence: string): boolean {
  return getResultsClarityVariant(confidence) === 'low-confidence';
}

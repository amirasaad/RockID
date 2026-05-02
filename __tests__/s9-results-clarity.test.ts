import { describe, expect, it } from 'vitest';

import { getResultsClarityVariant, isLowConfidenceVariant } from '@/lib/results-clarity';

describe('S9 results clarity', () => {
  it('returns low-confidence variant only for Low confidence results', () => {
    expect(getResultsClarityVariant('Low')).toBe('low-confidence');
    expect(getResultsClarityVariant('Medium')).toBe('default');
    expect(getResultsClarityVariant('High')).toBe('default');
  });

  it('exposes a readable low-confidence boolean helper', () => {
    expect(isLowConfidenceVariant('Low')).toBe(true);
    expect(isLowConfidenceVariant('High')).toBe(false);
  });
});

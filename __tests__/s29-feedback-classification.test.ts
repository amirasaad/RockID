import { describe, expect, it } from 'vitest';

import { classifyResultFeedbackChoice } from '@/lib/results-clarity';

describe('S29 result feedback classification', () => {
  it('maps not useful feedback to uncertain for low-confidence results', () => {
    expect(classifyResultFeedbackChoice({ confidence: 'Low', isUseful: false })).toBe('uncertain');
  });

  it('maps not useful feedback to wrong for non-low-confidence results', () => {
    expect(classifyResultFeedbackChoice({ confidence: 'High', isUseful: false })).toBe('wrong');
    expect(classifyResultFeedbackChoice({ confidence: 'Medium', isUseful: false })).toBe('wrong');
  });

  it('keeps useful feedback as useful for any confidence', () => {
    expect(classifyResultFeedbackChoice({ confidence: 'Low', isUseful: true })).toBe('useful');
    expect(classifyResultFeedbackChoice({ confidence: 'High', isUseful: true })).toBe('useful');
  });
});

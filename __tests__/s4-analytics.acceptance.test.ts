import { describe, expect, it, vi } from 'vitest';

import { __setAnalyticsSinkForTesting, track } from '@/lib/analytics';

describe('S4 analytics acceptance', () => {
  it('tracks events through an injected sink', () => {
    const sink = vi.fn();
    __setAnalyticsSinkForTesting(sink);

    track('home_viewed', { source: 'test' });
    track('low_confidence_result_viewed', { sessionId: 'sess-1' });
    track('low_confidence_add_photo_tapped', { sessionId: 'sess-1' });

    expect(sink).toHaveBeenNthCalledWith(1, 'home_viewed', { source: 'test' });
    expect(sink).toHaveBeenNthCalledWith(2, 'low_confidence_result_viewed', { sessionId: 'sess-1' });
    expect(sink).toHaveBeenNthCalledWith(3, 'low_confidence_add_photo_tapped', { sessionId: 'sess-1' });
  });
});

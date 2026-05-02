import { describe, expect, it, vi } from 'vitest';

import { __setAnalyticsSinkForTesting, track } from '@/lib/analytics';

describe('S4 analytics acceptance', () => {
  it('tracks events through an injected sink', () => {
    const sink = vi.fn();
    __setAnalyticsSinkForTesting(sink);

    track('home_viewed', { source: 'test' });

    expect(sink).toHaveBeenCalledWith('home_viewed', { source: 'test' });
  });
});

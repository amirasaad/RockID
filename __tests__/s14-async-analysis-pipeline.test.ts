import { describe, expect, it } from 'vitest';

import { analyzeIdentificationSession, analyzeIdentificationSessionAsync } from '@/lib/mock-analysis';

describe('S14 async analysis pipeline', () => {
  it('exposes an async analysis helper that matches the sync implementation', async () => {
    const analysis = await analyzeIdentificationSessionAsync(null);

    expect(analysis).toEqual(expect.objectContaining(analyzeIdentificationSession(null)));
    expect(analysis.diagnostics).toEqual({
      engine: 'detailsMock',
      fallback: false,
      durationMs: expect.any(Number),
    });
  });
});


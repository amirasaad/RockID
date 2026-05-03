import { describe, expect, it } from 'vitest';

import { analyzeIdentificationSession, analyzeIdentificationSessionAsync } from '@/lib/mock-analysis';

describe('S14 async analysis pipeline', () => {
  it('exposes an async analysis helper that matches the sync implementation', async () => {
    expect(await analyzeIdentificationSessionAsync(null)).toEqual(analyzeIdentificationSession(null));
  });
});


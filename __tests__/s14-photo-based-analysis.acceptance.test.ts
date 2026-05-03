import { describe, expect, it, vi } from 'vitest';

import type { IdentificationSession } from '@/lib/identification-session';
import { analyzeIdentificationSessionAsync } from '@/lib/mock-analysis';

describe('S14 photo-based analysis acceptance', () => {
  it('returns an analysis result when a photo URI is present', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      status: 200,
      arrayBuffer: async () => Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8]).buffer,
    }));
    vi.stubGlobal('fetch', fetchMock);

    const session: IdentificationSession = {
      id: 'sess-photo-1',
      selectedPhoto: {
        source: 'upload',
        uri: 'https://example.com/rock.jpg',
        width: 1200,
        height: 900,
      },
      observations: {
        color: '',
        grainSize: '',
        features: [],
        notes: '',
      },
      createdAt: 1,
      updatedAt: 1,
    };

    const analysis = await analyzeIdentificationSessionAsync(session);

    expect(analysis.sessionId).toBe('sess-photo-1');
    expect(analysis.matches.length).toBeGreaterThan(0);
    expect(analysis.topMatch).toEqual(analysis.matches[0]);
    expect(['High', 'Medium', 'Low']).toContain(analysis.topMatch.confidence);
    expect(analysis.topMatch.confidence).not.toBe('Low');
    expect(analysis.reasoning).toContain('embedding');
    expect(typeof analysis.nextCheck).toBe('string');
  });
});

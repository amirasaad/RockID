import { afterEach, describe, expect, it, vi } from 'vitest';

import type { IdentificationSession } from '@/lib/identification-session';
import { analyzeIdentificationSessionAsync } from '@/lib/mock-analysis';

describe('S14 photo-based analysis acceptance', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns an analysis result when photo mode is selected', async () => {
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
      analysisMode: 'photo',
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

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('https://example.com/rock.jpg');
    expect(analysis.sessionId).toBe('sess-photo-1');
    expect(analysis.imageUri).toBe('https://example.com/rock.jpg');
    expect(analysis.matches.length).toBeGreaterThan(0);
    expect(['Granite', 'Basalt', 'Slag', 'Obsidian']).toContain(analysis.matches[0]?.name);
    expect(analysis.topMatch).toEqual(analysis.matches[0]);
    expect(['High', 'Medium', 'Low']).toContain(analysis.topMatch.confidence);
    if (analysis.topMatch.confidence === 'Low') {
      expect(analysis.reasoning).toContain('not enough evidence');
    } else {
      expect(analysis.reasoning).toContain('Photo embedding');
    }
    expect(typeof analysis.nextCheck).toBe('string');
  });

  it('keeps selected photos in details mode unless photo preview is selected', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const session: IdentificationSession = {
      id: 'sess-details-1',
      selectedPhoto: {
        source: 'upload',
        uri: 'https://example.com/rock.jpg',
        width: 1200,
        height: 900,
      },
      observations: {
        color: 'Dark',
        grainSize: 'Fine',
        features: ['Vesicles'],
        notes: 'Dark fine-grained sample with holes.',
      },
      createdAt: 1,
      updatedAt: 1,
    };

    const analysis = await analyzeIdentificationSessionAsync(session);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(analysis.topMatch.name).toBe('Basalt');
    expect(analysis.topMatch).toEqual(analysis.matches[0]);
    expect(analysis.reasoning).toContain('vesicles');
  });
});

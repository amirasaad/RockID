import { afterEach, describe, expect, it, vi } from 'vitest';

import { getConfiguredAnalyzerKind, __resetAnalyzerKindConfigForTesting } from '@/lib/analyzer-kind';
import { analyzeIdentificationSessionWithConfiguredAnalyzerAsync } from '@/lib/configured-analysis';

describe('S15 analyzer feature flag', () => {
  afterEach(() => {
    __resetAnalyzerKindConfigForTesting();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('defaults to the mock analyzer', () => {
    expect(getConfiguredAnalyzerKind()).toBe('mock');
  });

  it('allows a global override', () => {
    (globalThis as { __ROCKID_ANALYZER_KIND__?: unknown }).__ROCKID_ANALYZER_KIND__ = 'onDeviceClipKnn';
    expect(getConfiguredAnalyzerKind()).toBe('onDeviceClipKnn');
  });

  it('routes analysis through the configured analyzer', async () => {
    (globalThis as { __ROCKID_ANALYZER_KIND__?: unknown }).__ROCKID_ANALYZER_KIND__ = 'onDeviceClipKnn';

    const fetchMock = vi.fn(async () => ({
      ok: true,
      status: 200,
      arrayBuffer: async () => Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8]).buffer,
    }));
    vi.stubGlobal('fetch', fetchMock);

    const analysis = await analyzeIdentificationSessionWithConfiguredAnalyzerAsync({
      id: 's15-session',
      selectedPhoto: { source: 'upload', uri: 'https://example.com/rock.jpg' },
      observations: { color: '', grainSize: '', features: [], notes: '' },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      analysisMode: 'details',
    });

    expect(analysis.diagnostics).toEqual(
      expect.objectContaining({
        engine: 'photoBytesPreview',
        fallback: false,
        durationMs: expect.any(Number),
      })
    );
    expect(fetchMock).toHaveBeenCalled();
  });

  it('falls back to mock analysis when photo embedding fails', async () => {
    (globalThis as { __ROCKID_ANALYZER_KIND__?: unknown }).__ROCKID_ANALYZER_KIND__ = 'onDeviceClipKnn';

    const fetchMock = vi.fn(async () => {
      throw new Error('network down');
    });
    vi.stubGlobal('fetch', fetchMock);

    const analysis = await analyzeIdentificationSessionWithConfiguredAnalyzerAsync({
      id: 's15-session',
      selectedPhoto: { source: 'upload', uri: 'https://example.com/rock.jpg' },
      observations: { color: '', grainSize: '', features: [], notes: '' },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      analysisMode: 'details',
    });

    expect(analysis.diagnostics).toEqual(
      expect.objectContaining({
        engine: 'detailsMock',
        fallback: true,
        durationMs: expect.any(Number),
      })
    );
  });
});


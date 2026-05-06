import { afterEach, describe, expect, it, vi } from 'vitest';

import { getConfiguredAnalyzerKind, __resetAnalyzerKindConfigForTesting } from '@/lib/analyzer-kind';

describe('S27 default analyzer kind', () => {
  afterEach(() => {
    __resetAnalyzerKindConfigForTesting();
    vi.unstubAllGlobals();
  });

  it('defaults to onDeviceClipKnn when no overrides are set', () => {
    expect(getConfiguredAnalyzerKind()).toBe('onDeviceClipKnn');
  });

  it('allows mock as an explicit override via env', () => {
    vi.stubEnv('EXPO_PUBLIC_ROCKID_ANALYZER_KIND', 'mock');
    expect(getConfiguredAnalyzerKind()).toBe('mock');
  });

  it('allows onDeviceClipKnn as an explicit override via env', () => {
    vi.stubEnv('EXPO_PUBLIC_ROCKID_ANALYZER_KIND', 'onDeviceClipKnn');
    expect(getConfiguredAnalyzerKind()).toBe('onDeviceClipKnn');
  });

  it('allows global override', () => {
    (globalThis as { __ROCKID_ANALYZER_KIND__?: unknown }).__ROCKID_ANALYZER_KIND__ = 'mock';
    expect(getConfiguredAnalyzerKind()).toBe('mock');
  });
});

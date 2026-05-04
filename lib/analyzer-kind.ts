export type AnalyzerKind = 'mock' | 'onDeviceClipKnn';

let configuredKind: AnalyzerKind | null = null;

export function configureAnalyzerKind(input: { kind: AnalyzerKind }): void {
  configuredKind = input.kind;
}

export function getConfiguredAnalyzerKind(): AnalyzerKind {
  const globalKind = (globalThis as { __ROCKID_ANALYZER_KIND__?: unknown }).__ROCKID_ANALYZER_KIND__;
  if (globalKind === 'mock' || globalKind === 'onDeviceClipKnn') {
    return globalKind;
  }

  const envKind = readEnvAnalyzerKind();
  if (envKind) return envKind;

  if (configuredKind) return configuredKind;

  return 'mock';
}

export function __resetAnalyzerKindConfigForTesting(): void {
  configuredKind = null;
  delete (globalThis as { __ROCKID_ANALYZER_KIND__?: unknown }).__ROCKID_ANALYZER_KIND__;
}

function readEnvAnalyzerKind(): AnalyzerKind | null {
  const env = typeof process === 'undefined' ? undefined : process.env;
  const raw = env?.EXPO_PUBLIC_ROCKID_ANALYZER_KIND ?? env?.EXPO_PUBLIC_ROCKID_ANALYZER;
  if (raw === 'mock' || raw === 'onDeviceClipKnn') {
    return raw;
  }
  return null;
}

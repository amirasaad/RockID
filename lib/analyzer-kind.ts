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
  const raw =
    typeof process !== 'undefined' && process.env
      ? (process.env.EXPO_PUBLIC_ROCKID_ANALYZER_KIND ?? process.env.EXPO_PUBLIC_ROCKID_ANALYZER)
      : undefined;
  if (raw === 'mock' || raw === 'onDeviceClipKnn') {
    return raw;
  }
  return null;
}

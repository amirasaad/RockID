import type { IdentificationAnalysis, IdentificationSession } from './identification-session';

import { getConfiguredAnalyzerKind } from './analyzer-kind';
import { analyzeIdentificationSessionAsync } from './mock-analysis';
import { analyzeIdentificationSessionWithOnDeviceClipKnnAsync } from './on-device-clip-knn-analysis';

export async function analyzeIdentificationSessionWithConfiguredAnalyzerAsync(
  session: IdentificationSession | null
): Promise<IdentificationAnalysis> {
  const kind = getConfiguredAnalyzerKind();
  if (kind === 'onDeviceClipKnn') {
    return analyzeIdentificationSessionWithOnDeviceClipKnnAsync(session);
  }

  return analyzeIdentificationSessionAsync(session);
}


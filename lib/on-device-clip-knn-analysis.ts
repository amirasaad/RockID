import type { IdentificationAnalysis, IdentificationSession } from './identification-session';

import { createClipKnnAnalyzerAsync, normalizeVector, type VectorIndexItem } from './clip-knn';
import { identifyRockPhotoOnDevice } from './clip-bytes-embedder';
import { OnDeviceImageEncoderUnavailableError } from './on-device-image-encoder';
import { getConfiguredOnDeviceImageEncoder } from './on-device-image-encoder-registry';
import { analyzeIdentificationSession } from './mock-analysis';
import { adaptVectorToDimension } from './vector-dimension';

type PhotoAnalysisEngine = 'photoBytesPreview' | 'photoOnDeviceEncoder';

const EMBEDDING_DIMENSION = 8;

const photoIndex: VectorIndexItem[] = [
  { id: 'photo-granite-1', label: 'Granite', kind: 'rock', embedding: normalizeVector([1, 0, 0, 0, 0, 0, 0, 0]) },
  { id: 'photo-basalt-1', label: 'Basalt', kind: 'rock', embedding: normalizeVector([0, 1, 0, 0, 0, 0, 0, 0]) },
  { id: 'photo-slag-1', label: 'Slag', kind: 'non-rock', embedding: normalizeVector([0, 0, 1, 0, 0, 0, 0, 0]) },
  { id: 'photo-obsidian-1', label: 'Obsidian', kind: 'rock', embedding: normalizeVector([0, 0, 0, 1, 0, 0, 0, 0]) },
  { id: 'photo-glass-1', label: 'Glass', kind: 'non-rock', embedding: normalizeVector([0, 0, 0, 0, 1, 0, 0, 0]) },
  { id: 'photo-asphalt-1', label: 'Asphalt', kind: 'non-rock', embedding: normalizeVector([0, 0, 0, 0, 0, 1, 0, 0]) },
  { id: 'photo-coal-1', label: 'Coal', kind: 'non-rock', embedding: normalizeVector([0, 0, 0, 0, 0, 0, 1, 0]) },
  { id: 'photo-concrete-1', label: 'Concrete', kind: 'non-rock', embedding: normalizeVector([0, 0, 1, 0, 0, 0.5, 0, 0]) },
  { id: 'photo-brick-1', label: 'Brick', kind: 'non-rock', embedding: normalizeVector([0, 0, 0, 0, 1, 0, 0.5, 0]) },
  { id: 'photo-plastic-1', label: 'Plastic', kind: 'non-rock', embedding: normalizeVector([0, 0, 0, 0, 0, 1, 0, 0.5]) },
];

async function embedPhotoSession(input: { session: IdentificationSession }): Promise<{ vector: number[]; engine: PhotoAnalysisEngine }> {
  const photoUri = input.session.selectedPhoto?.uri;
  if (!photoUri) {
    throw new Error('Photo URI is required for photo-based analysis.');
  }

  const encoder = getConfiguredOnDeviceImageEncoder();
  if (encoder) {
    try {
      const rawVector = await encoder.encodePhotoUri(photoUri);
      return { vector: adaptVectorToDimension(rawVector, EMBEDDING_DIMENSION), engine: 'photoOnDeviceEncoder' };
    } catch (error) {
      if (!(error instanceof OnDeviceImageEncoderUnavailableError)) {
        throw error;
      }
    }
  }

  return {
    vector: await identifyRockPhotoOnDevice({ photoUri, embeddingDimension: EMBEDDING_DIMENSION }),
    engine: 'photoBytesPreview',
  };
}

export async function analyzeIdentificationSessionWithOnDeviceClipKnnAsync(
  session: IdentificationSession | null
): Promise<IdentificationAnalysis> {
  const startedAt = Date.now();
  const photoUri = session?.selectedPhoto?.uri;

  if (!session || !photoUri) {
    return withDiagnostics(analyzeIdentificationSession(session), 'detailsMock', false, startedAt);
  }

  try {
    const embedded = await embedPhotoSession({ session });
    const analyzer = createClipKnnAnalyzerAsync({
      index: photoIndex,
      topK: 3,
      embed: async () => embedded.vector,
    });

    const analysis = await analyzer(session);
    const topConfidence = analysis.topMatch.confidence;
    const isNonRockTopMatch = analysis.topMatch.category === 'Non-rock look-alike';
    const guardedConfidence = isNonRockTopMatch && topConfidence === 'High' ? 'Medium' : topConfidence;

    return withDiagnostics(
      {
        sessionId: session.id,
        imageUri: photoUri,
        matches: analysis.matches.map((match, index) =>
          isNonRockTopMatch && index === 0 && match.confidence === 'High' ? { ...match, confidence: 'Medium' } : match
        ),
        topMatch: isNonRockTopMatch && analysis.topMatch.confidence === 'High' ? { ...analysis.topMatch, confidence: 'Medium' } : analysis.topMatch,
        reasoning:
          guardedConfidence === 'Low'
            ? 'There is not enough evidence from the photo to suggest a confident rock match yet.'
            : isNonRockTopMatch
              ? 'The photo looks closer to a non-rock look-alike than a natural rock.'
            : embedded.engine === 'photoOnDeviceEncoder'
              ? 'Photo embedding similarity match using an on-device encoder.'
              : 'Photo embedding similarity match using a byte-based placeholder embedder.',
        nextCheck:
          guardedConfidence === 'Low'
            ? 'Try again: add a clearer photo, color, grain size, or visible features before trusting the match.'
            : isNonRockTopMatch
              ? 'Double-check for glassy texture, metallic sheen, bubbles, or uniform melt features that suggest slag or another human-made material.'
            : 'If results look wrong, add another close-up photo and confirm grain size, color, and any visible crystals.',
      },
      embedded.engine,
      false,
      startedAt
    );
  } catch {
    return withDiagnostics(analyzeIdentificationSession(session), 'detailsMock', true, startedAt);
  }
}

function withDiagnostics(
  analysis: IdentificationAnalysis,
  engine: NonNullable<IdentificationAnalysis['diagnostics']>['engine'],
  fallback: boolean,
  startedAt: number
): IdentificationAnalysis {
  return {
    ...analysis,
    diagnostics: {
      engine,
      fallback,
      durationMs: Math.max(0, Date.now() - startedAt),
    },
  };
}

import type { IdentificationAnalysis, IdentificationSession, RockObservations } from './identification-session';
import type { RockMatch } from './mock-data';
import { topMatches } from './mock-data';
import { createClipKnnAnalyzerAsync, normalizeVector, type VectorIndexItem } from './clip-knn';
import { identifyRockPhotoOnDevice } from './clip-bytes-embedder';

export type MockAnalysisResult = IdentificationAnalysis;

const ROCK_BASALT = 'Basalt';
const ROCK_UNCLEAR_SAMPLE = 'Unclear rock sample';

const basaltMatches: RockMatch[] = [
  {
    name: ROCK_BASALT,
    category: 'Igneous volcanic',
    confidence: 'High',
    score: 82,
  },
  {
    name: 'Scoria',
    category: 'Igneous volcanic',
    confidence: 'Medium',
    score: 12,
  },
  {
    name: 'Dark Slag',
    category: 'Human-made look-alike',
    confidence: 'Low',
    score: 6,
  },
];

const lowConfidenceMatches: RockMatch[] = [
  {
    name: ROCK_UNCLEAR_SAMPLE,
    category: 'Needs more evidence',
    confidence: 'Low',
    score: 38,
  },
  {
    name: 'Granite',
    category: 'Igneous intrusive',
    confidence: 'Low',
    score: 34,
  },
  {
    name: ROCK_BASALT,
    category: 'Igneous volcanic',
    confidence: 'Low',
    score: 28,
  },
];

const photoIndex: VectorIndexItem[] = [
  { id: 'photo-granite-1', label: 'Granite', kind: 'rock', embedding: normalizeVector([1, 0, 0, 0, 0, 0, 0, 0]) },
  { id: 'photo-basalt-1', label: 'Basalt', kind: 'rock', embedding: normalizeVector([0, 1, 0, 0, 0, 0, 0, 0]) },
  { id: 'photo-slag-1', label: 'Slag', kind: 'non-rock', embedding: normalizeVector([0, 0, 1, 0, 0, 0, 0, 0]) },
  { id: 'photo-obsidian-1', label: 'Obsidian', kind: 'rock', embedding: normalizeVector([0, 0, 0, 1, 0, 0, 0, 0]) },
];

const photoAnalyzer = createClipKnnAnalyzerAsync({
  index: photoIndex,
  topK: 3,
  embed: async (session) => {
    const photoUri = session.selectedPhoto?.uri;
    if (!photoUri) {
      throw new Error('Photo URI is required for photo-based analysis.');
    }
    return identifyRockPhotoOnDevice({ photoUri, embeddingDimension: 8 });
  },
});

export function analyzeIdentificationSession(session: IdentificationSession | null): MockAnalysisResult {
  const matches = selectMockMatches(session?.observations);
  const [topMatch] = matches;

  return {
    sessionId: session?.id ?? 'sample-session',
    imageUri: session?.selectedPhoto?.uri,
    matches,
    topMatch,
    reasoning: reasoningFor(topMatch.name),
    nextCheck: nextCheckFor(topMatch.name),
  };
}

/**
 * Async wrapper for the current analysis implementation.
 * @param session - Current identification session (or null).
 * @returns Analysis result as a promise.
 */
export async function analyzeIdentificationSessionAsync(session: IdentificationSession | null): Promise<MockAnalysisResult> {
  const mode = session?.analysisMode ?? 'details';
  const photoUri = session?.selectedPhoto?.uri;
  if (!photoUri) return analyzeIdentificationSession(session);
  if (mode !== 'photo') return analyzeIdentificationSession(session);

  try {
    const analysis = await photoAnalyzer(session);

    return {
      sessionId: session.id,
      imageUri: photoUri,
      matches: analysis.matches,
      topMatch: analysis.topMatch,
      reasoning:
        analysis.topMatch.confidence === 'Low'
          ? 'There is not enough evidence from the photo to suggest a confident rock match yet.'
          : 'Photo embedding similarity match using a placeholder on-device embedder.',
      nextCheck:
        analysis.topMatch.confidence === 'Low'
          ? 'Try again: add a clearer photo, color, grain size, or visible features before trusting the match.'
          : 'If results look wrong, add another close-up photo and confirm grain size, color, and any visible crystals.',
    };
  } catch {
    return analyzeIdentificationSession(session);
  }
}

function selectMockMatches(observations?: RockObservations): RockMatch[] {
  if (hasWeakEvidence(observations)) {
    return lowConfidenceMatches;
  }

  if (shouldUseBasaltFixture(observations)) {
    return basaltMatches;
  }

  return topMatches;
}

function hasWeakEvidence(observations?: RockObservations): boolean {
  const hasColor = Boolean(observations?.color);
  const hasGrainSize = Boolean(observations?.grainSize);
  const hasFeatures = Boolean(observations?.features.length);
  const hasNotes = Boolean(observations?.notes.trim());

  return !hasColor && !hasGrainSize && !hasFeatures && !hasNotes;
}

function shouldUseBasaltFixture(observations?: RockObservations): boolean {
  return (
    observations?.color === 'Dark' &&
    observations.grainSize === 'Fine' &&
    observations.features.includes('Vesicles')
  );
}

const reasoningByRockName: Partial<Record<string, string>> = {
  [ROCK_BASALT]: 'Dark color, fine grain, and vesicles point toward a volcanic rock such as basalt.',
  [ROCK_UNCLEAR_SAMPLE]: 'There is not enough evidence from the photo and observations to suggest a confident rock match yet.',
};

const nextCheckByRockName: Partial<Record<string, string>> = {
  [ROCK_BASALT]: 'Check whether the vesicles are rounded and whether the sample lacks visible quartz crystals.',
  [ROCK_UNCLEAR_SAMPLE]: 'Try again: add a clearer photo, color, grain size, or visible features before trusting the match.',
};

function reasoningFor(rockName: string): string {
  return (
    reasoningByRockName[rockName] ??
    'Coarse interlocking grains, visible feldspar and quartz, and a massive texture all point toward granite.'
  );
}

function nextCheckFor(rockName: string): string {
  return nextCheckByRockName[rockName] ?? 'Look for foliation or mineral banding to rule out granitic gneiss.';
}

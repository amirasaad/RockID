import type { IdentificationAnalysis, IdentificationSession, RockObservations } from './identification-session';
import type { RockMatch } from './mock-data';
import { topMatches } from './mock-data';

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

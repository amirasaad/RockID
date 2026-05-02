import type { IdentificationSession, RockObservations } from './identification-session';
import type { RockMatch } from './mock-data';
import { topMatches } from './mock-data';

export type MockAnalysisResult = {
  sessionId: string;
  imageUri?: string;
  matches: RockMatch[];
  topMatch: RockMatch;
  reasoning: string;
  nextCheck: string;
};

const basaltMatches: RockMatch[] = [
  {
    name: 'Basalt',
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
    name: 'Unclear rock sample',
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
    name: 'Basalt',
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
  return !observations?.color && !observations?.grainSize && !observations?.features.length && !observations?.notes.trim();
}

function shouldUseBasaltFixture(observations?: RockObservations): boolean {
  return (
    observations?.color === 'Dark' &&
    observations.grainSize === 'Fine' &&
    observations.features.includes('Vesicles')
  );
}

function reasoningFor(rockName: string): string {
  if (rockName === 'Basalt') {
    return 'Dark color, fine grain, and vesicles point toward a volcanic rock such as basalt.';
  }

  if (rockName === 'Unclear rock sample') {
    return 'There is not enough evidence from the photo and observations to suggest a confident rock match yet.';
  }

  return 'Coarse interlocking grains, visible feldspar and quartz, and a massive texture all point toward granite.';
}

function nextCheckFor(rockName: string): string {
  if (rockName === 'Basalt') {
    return 'Check whether the vesicles are rounded and whether the sample lacks visible quartz crystals.';
  }

  if (rockName === 'Unclear rock sample') {
    return 'Try again: add a clearer photo, color, grain size, or visible features before trusting the match.';
  }

  return 'Look for foliation or mineral banding to rule out granitic gneiss.';
}

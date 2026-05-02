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

export function analyzeIdentificationSession(session: IdentificationSession | null): MockAnalysisResult {
  const matches = shouldUseBasaltFixture(session?.observations) ? basaltMatches : topMatches;
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

  return 'Coarse interlocking grains, visible feldspar and quartz, and a massive texture all point toward granite.';
}

function nextCheckFor(rockName: string): string {
  if (rockName === 'Basalt') {
    return 'Check whether the vesicles are rounded and whether the sample lacks visible quartz crystals.';
  }

  return 'Look for foliation or mineral banding to rule out granitic gneiss.';
}

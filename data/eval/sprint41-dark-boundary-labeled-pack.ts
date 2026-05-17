import type { IdentificationSession, RockObservations } from '@/lib/identification-session';
import type { RockIdEvalFixture } from '@/lib/rock-id-eval';

export type Sprint41BoundaryCluster = 'basalt-vs-slag' | 'basalt-vs-asphalt' | 'basalt-vs-coal';

export type Sprint41PhotoConditions = {
  lighting: 'daylight' | 'shade' | 'wet-glare' | 'indoor';
  distance: 'macro' | 'hand-distance' | 'bench-distance';
  background: 'plain-paper' | 'hand' | 'pavement' | 'mixed-field';
  surfaceState: 'dry' | 'wet' | 'weathered' | 'fresh-break';
};

export type Sprint41AcceptanceChecks = {
  expectedTop3Label: string;
  confidencePolicy: 'allow-low-confidence' | 'prefer-uncertainty' | 'reject-high-confidence-rock-claim';
  allowHighConfidenceWrongRock: false;
  notes: string;
};

export type Sprint41DarkBoundarySample = {
  id: string;
  expectedLabel: string;
  expectedKind: RockIdEvalFixture['expectedKind'];
  boundaryCluster: Sprint41BoundaryCluster;
  sampleType: string;
  rationale: string;
  photoConditions: Sprint41PhotoConditions;
  acceptanceChecks: Sprint41AcceptanceChecks;
  fixture: RockIdEvalFixture;
};

type SampleInput = Omit<Sprint41DarkBoundarySample, 'fixture'> & {
  observations: RockObservations;
};

/**
 * Sprint 41 labeled boundary pack.
 *
 * This is evidence scaffolding only. It intentionally describes the minimum
 * paired dark-boundary samples we need before another index-data experiment.
 */
export const sprint41DarkBoundaryLabeledPack: Sprint41DarkBoundarySample[] = [
  rock({
    id: 's41-rock-basalt-vesicular-shade-a',
    expectedLabel: 'Basalt',
    boundaryCluster: 'basalt-vs-slag',
    sampleType: 'vesicular basalt in shade',
    rationale: 'Rock-side pair for Sprint 40 unsafe Slag shadow candidate; should stay Basalt but may be Low confidence.',
    photoConditions: {
      lighting: 'shade',
      distance: 'hand-distance',
      background: 'plain-paper',
      surfaceState: 'weathered',
    },
    acceptanceChecks: {
      expectedTop3Label: 'Basalt',
      confidencePolicy: 'prefer-uncertainty',
      allowHighConfidenceWrongRock: false,
      notes: 'Expected answer should remain visible without rewarding overconfident Basalt claims.',
    },
    observations: {
      color: 'Dark',
      grainSize: 'Fine',
      features: ['Vesicles', 'Rough Surface'],
      notes: 'Known basalt sample photographed in shade; paired against rusty vesicular slag.',
    },
  }),
  nonRock({
    id: 's41-non-rock-slag-rusty-vesicular-a',
    expectedLabel: 'Slag',
    boundaryCluster: 'basalt-vs-slag',
    sampleType: 'rusty vesicular industrial slag',
    rationale: 'Direct non-rock pair for vesicular basalt; should never become a confident rock claim.',
    photoConditions: {
      lighting: 'shade',
      distance: 'hand-distance',
      background: 'plain-paper',
      surfaceState: 'weathered',
    },
    acceptanceChecks: {
      expectedTop3Label: 'Slag',
      confidencePolicy: 'reject-high-confidence-rock-claim',
      allowHighConfidenceWrongRock: false,
      notes: 'This is the class of failure that blocked Sprint 40 promotion.',
    },
    observations: {
      color: 'Dark',
      grainSize: 'Fine',
      features: ['Vesicles', 'Metallic Sheen', 'Rough Surface'],
      notes: 'Known slag confuser with rusty vesicles and industrial texture.',
    },
  }),
  rock({
    id: 's41-rock-basalt-fresh-break-a',
    expectedLabel: 'Basalt',
    boundaryCluster: 'basalt-vs-asphalt',
    sampleType: 'fresh dark basalt break',
    rationale: 'Cleaner rock-side Basalt anchor for comparison against wet asphalt aggregate.',
    photoConditions: {
      lighting: 'daylight',
      distance: 'macro',
      background: 'plain-paper',
      surfaceState: 'fresh-break',
    },
    acceptanceChecks: {
      expectedTop3Label: 'Basalt',
      confidencePolicy: 'allow-low-confidence',
      allowHighConfidenceWrongRock: false,
      notes: 'A clear rock anchor should keep Basalt in Top-3 even if Top-1 remains conservative.',
    },
    observations: {
      color: 'Dark',
      grainSize: 'Fine',
      features: ['Fine Grained', 'Massive Texture'],
      notes: 'Known basalt fresh break; less vesicular than the slag-boundary case.',
    },
  }),
  nonRock({
    id: 's41-non-rock-asphalt-wet-aggregate-a',
    expectedLabel: 'Asphalt',
    boundaryCluster: 'basalt-vs-asphalt',
    sampleType: 'wet asphalt aggregate chip',
    rationale: 'Dark granular non-rock with glare and visible aggregate near Basalt overclaim risk.',
    photoConditions: {
      lighting: 'wet-glare',
      distance: 'bench-distance',
      background: 'pavement',
      surfaceState: 'wet',
    },
    acceptanceChecks: {
      expectedTop3Label: 'Asphalt',
      confidencePolicy: 'reject-high-confidence-rock-claim',
      allowHighConfidenceWrongRock: false,
      notes: 'Wet glare should not become confident Basalt just because the material is dark and granular.',
    },
    observations: {
      color: 'Dark',
      grainSize: 'Fine',
      features: ['Visible Aggregate', 'Wet Surface', 'Granular Texture'],
      notes: 'Known asphalt fragment photographed wet on pavement.',
    },
  }),
  rock({
    id: 's41-rock-basalt-dull-massive-a',
    expectedLabel: 'Basalt',
    boundaryCluster: 'basalt-vs-coal',
    sampleType: 'dull massive basalt',
    rationale: 'Rock-side pair for dark dull coal; should keep Basalt visible without confusing shine/fracture cues.',
    photoConditions: {
      lighting: 'indoor',
      distance: 'hand-distance',
      background: 'hand',
      surfaceState: 'dry',
    },
    acceptanceChecks: {
      expectedTop3Label: 'Basalt',
      confidencePolicy: 'prefer-uncertainty',
      allowHighConfidenceWrongRock: false,
      notes: 'Indoor light may reduce texture clarity; uncertainty is acceptable.',
    },
    observations: {
      color: 'Dark',
      grainSize: 'Fine',
      features: ['Dull Surface', 'Massive Texture'],
      notes: 'Known dull basalt sample under indoor lighting.',
    },
  }),
  nonRock({
    id: 's41-non-rock-coal-dull-fractured-a',
    expectedLabel: 'Coal',
    boundaryCluster: 'basalt-vs-coal',
    sampleType: 'dull fractured coal',
    rationale: 'Coal-side non-rock pair for dark dull Basalt boundary.',
    photoConditions: {
      lighting: 'indoor',
      distance: 'hand-distance',
      background: 'hand',
      surfaceState: 'fresh-break',
    },
    acceptanceChecks: {
      expectedTop3Label: 'Coal',
      confidencePolicy: 'reject-high-confidence-rock-claim',
      allowHighConfidenceWrongRock: false,
      notes: 'Coal may look rock-like; safe behavior is non-rock or low confidence, not confident Basalt.',
    },
    observations: {
      color: 'Dark',
      grainSize: 'Fine',
      features: ['Dull Surface', 'Layered Fracture', 'Conchoidal Fracture'],
      notes: 'Known coal fragment with dull fractured surface.',
    },
  }),
];

export const sprint41DarkBoundaryFixtures: RockIdEvalFixture[] = sprint41DarkBoundaryLabeledPack.map(
  (sample) => sample.fixture,
);

function rock(input: Omit<SampleInput, 'expectedKind'>): Sprint41DarkBoundarySample {
  return sample({ ...input, expectedKind: 'rock' });
}

function nonRock(input: Omit<SampleInput, 'expectedKind'>): Sprint41DarkBoundarySample {
  return sample({ ...input, expectedKind: 'non-rock' });
}

function sample(input: SampleInput): Sprint41DarkBoundarySample {
  return {
    ...input,
    fixture: {
      id: input.id,
      expectedLabel: input.expectedLabel,
      expectedKind: input.expectedKind,
      session: createSession(input.id, input.observations),
    },
  };
}

function createSession(id: string, observations: RockObservations): IdentificationSession {
  return {
    id: `eval-${id}`,
    selectedPhoto: {
      source: 'upload',
      uri: `file:///eval/sprint41/${id}.jpg`,
      width: 1200,
      height: 900,
    },
    observations,
    createdAt: 1,
    updatedAt: 1,
    analysisMode: 'photo',
  };
}

import type { IdentificationSession, RockObservations } from '@/lib/identification-session';
import type { RockIdEvalFixture } from '@/lib/rock-id-eval';

type FixtureInput = {
  id: string;
  expectedLabel: string;
  expectedKind?: RockIdEvalFixture['expectedKind'];
  observations: RockObservations;
};

export const sprint32NonRockGateFixtures: RockIdEvalFixture[] = [
  rock('s32-rock-granite-reference-a', 'Granite', {
    color: 'Light',
    grainSize: 'Coarse',
    features: ['Visible Crystals'],
    notes: 'Reference granite sample in clear daylight.',
  }),
  rock('s32-rock-basalt-reference-a', 'Basalt', {
    color: 'Dark',
    grainSize: 'Fine',
    features: ['Vesicles'],
    notes: 'Reference basalt sample with vesicles and dark matrix.',
  }),
  rock('s32-rock-ambiguous-shaded-a', 'Granite', {
    color: '',
    grainSize: '',
    features: [],
    notes: 'Ambiguous specimen under heavy shadow to exercise low-confidence behavior.',
  }),
  nonRock('s32-non-rock-slag-vesicular-a', 'Slag', {
    color: 'Dark',
    grainSize: 'Fine',
    features: ['Vesicles'],
    notes: 'Industrial slag fragment with bubbly cavities.',
  }),
  nonRock('s32-non-rock-glass-reflective-a', 'Glass', {
    color: 'Clear',
    grainSize: 'Glassy',
    features: ['Sharp Edges', 'Shiny Surface'],
    notes: 'Reflective shard with sharp edge profile.',
  }),
  nonRock('s32-non-rock-concrete-aggregate-a', 'Concrete', {
    color: 'Gray',
    grainSize: 'Fine',
    features: ['Visible Aggregate', 'Uniform Texture'],
    notes: 'Concrete chip showing sand and pebble aggregate.',
  }),
  nonRock('s32-non-rock-brick-weathered-a', 'Brick', {
    color: 'Red',
    grainSize: 'Fine',
    features: ['Porous Surface', 'Regular Shape'],
    notes: 'Weathered brick edge with porous baked-clay texture.',
  }),
  nonRock('s32-non-rock-plastic-molded-a', 'Plastic', {
    color: 'Various',
    grainSize: 'Smooth',
    features: ['Shiny Surface', 'Regular Shape'],
    notes: 'Molded synthetic fragment with regular edge geometry.',
  }),
  nonRock('s32-non-rock-concrete-wet-lighting-a', 'Concrete', {
    color: 'Gray',
    grainSize: 'Fine',
    features: ['Visible Aggregate', 'Wet Surface'],
    notes: 'Wet concrete at dusk with glare to test lighting confuser behavior.',
  }),
  nonRock('s32-non-rock-brick-mixed-background-a', 'Brick', {
    color: 'Red',
    grainSize: 'Fine',
    features: ['Porous Surface', 'Mixed Context'],
    notes: 'Brick piece captured on rocky ground background for mixed-material confuser coverage.',
  }),
];

function rock(id: string, expectedLabel: string, observations: RockObservations): RockIdEvalFixture {
  return fixture({ id, expectedLabel, observations });
}

function nonRock(id: string, expectedLabel: string, observations: RockObservations): RockIdEvalFixture {
  return fixture({ id, expectedLabel, expectedKind: 'non-rock', observations });
}

function fixture(input: FixtureInput): RockIdEvalFixture {
  return {
    id: input.id,
    expectedLabel: input.expectedLabel,
    expectedKind: input.expectedKind ?? 'rock',
    session: createSession(input.id, input.observations),
  };
}

function createSession(id: string, observations: RockObservations): IdentificationSession {
  return {
    id: `eval-${id}`,
    selectedPhoto: {
      source: 'upload',
      uri: `file:///eval/sprint32/${id}.jpg`,
      width: 1200,
      height: 900,
    },
    observations,
    createdAt: 1,
    updatedAt: 1,
    analysisMode: 'photo',
  };
}

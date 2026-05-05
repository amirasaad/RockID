import type { IdentificationSession, RockObservations } from '@/lib/identification-session';
import type { RockIdEvalFixture } from '@/lib/rock-id-eval';

type FieldQaFixtureInput = {
  id: string;
  expectedLabel: string;
  expectedKind?: RockIdEvalFixture['expectedKind'];
  observations: RockObservations;
};

export const fieldQaEvalFixtures: RockIdEvalFixture[] = [
  rock('field-rock-granite-a', 'Granite', {
    color: 'Light',
    grainSize: 'Coarse',
    features: ['Visible Crystals'],
    notes: 'Field photo: coarse light sample with visible crystals.',
  }),
  rock('field-rock-basalt-a', 'Basalt', {
    color: 'Dark',
    grainSize: 'Fine',
    features: ['Vesicles'],
    notes: 'Field photo: dark fine-grained sample with vesicles.',
  }),
  rock('field-rock-ambiguous-a', 'Granite', {
    color: '',
    grainSize: '',
    features: [],
    notes: 'Field photo: intentionally ambiguous sample to track low-confidence behavior.',
  }),
  nonRock('field-non-rock-glass-a', 'Glass', {
    color: 'Clear',
    grainSize: 'Glassy',
    features: ['Sharp Edges'],
    notes: 'Field photo: glass-like shard with sharp edges.',
  }),
  nonRock('field-non-rock-slag-a', 'Slag', {
    color: 'Dark',
    grainSize: 'Fine',
    features: ['Vesicles'],
    notes: 'Field photo: bubbly dark human-made material.',
  }),
  nonRock('field-non-rock-asphalt-a', 'Asphalt', {
    color: 'Black',
    grainSize: 'Fine',
    features: ['Uniform Texture'],
    notes: 'Field photo: black uniform surface typical of asphalt.',
  }),
  nonRock('field-non-rock-coal-a', 'Coal', {
    color: 'Black',
    grainSize: 'Fine',
    features: ['Dull Luster'],
    notes: 'Field photo: black fragment with dull luster and low visible grain.',
  }),
  nonRock('field-non-rock-concrete-a', 'Concrete', {
    color: 'Gray',
    grainSize: 'Fine',
    features: ['Uniform Texture', 'Visible Aggregate'],
    notes: 'Field photo: gray human-made material with visible aggregate particles.',
  }),
  nonRock('field-non-rock-brick-a', 'Brick', {
    color: 'Red',
    grainSize: 'Fine',
    features: ['Porous Surface', 'Regular Shape'],
    notes: 'Field photo: reddish fired clay material with porous surface.',
  }),
  nonRock('field-non-rock-plastic-a', 'Plastic', {
    color: 'Various',
    grainSize: 'Smooth',
    features: ['Shiny Surface', 'Lightweight'],
    notes: 'Field photo: synthetic material with unnatural shine and color.',
  }),
  rock('field-rock-granite-poor-light', 'Granite', {
    color: 'Light',
    grainSize: 'Coarse',
    features: ['Visible Crystals'],
    notes: 'Field photo: granite sample in poor lighting conditions, shadows obscure crystal detail.',
  }),
  rock('field-rock-basalt-partial-frame', 'Basalt', {
    color: 'Dark',
    grainSize: 'Fine',
    features: ['Vesicles'],
    notes: 'Field photo: basalt sample partially out of frame, only 60% visible.',
  }),
  rock('field-rock-obsidian-blurry', 'Obsidian', {
    color: 'Dark',
    grainSize: 'Glassy',
    features: ['Sharp Edges', 'Conchoidal Fracture'],
    notes: 'Field photo: obsidian sample with motion blur, taken while moving.',
  }),
  rock('field-rock-mixed-materials', 'Granite', {
    color: 'Light',
    grainSize: 'Coarse',
    features: ['Visible Crystals', 'Mixed Context'],
    notes: 'Field photo: granite on asphalt surface, mixed materials in frame.',
  }),
];

function rock(id: string, expectedLabel: string, observations: RockObservations): RockIdEvalFixture {
  return fixture({ id, expectedLabel, observations });
}

function nonRock(id: string, expectedLabel: string, observations: RockObservations): RockIdEvalFixture {
  return fixture({ id, expectedLabel, expectedKind: 'non-rock', observations });
}

function fixture(input: FieldQaFixtureInput): RockIdEvalFixture {
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
      uri: `file:///eval/field/${id}.jpg`,
      width: 1200,
      height: 900,
    },
    observations,
    createdAt: 1,
    updatedAt: 1,
    analysisMode: 'photo',
  };
}

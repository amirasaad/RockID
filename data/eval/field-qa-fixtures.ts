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

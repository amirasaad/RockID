import type { IdentificationSession, RockObservations } from '@/lib/identification-session';
import type { RockIdEvalFixture } from '@/lib/rock-id-eval';

type FixtureInput = {
  id: string;
  expectedLabel: string;
  expectedKind?: RockIdEvalFixture['expectedKind'];
  observations: RockObservations;
};

/**
 * Sprint 40 dark-confuser fixture slice.
 *
 * One-variable experiment: fixture data only. These cases target the selected
 * S39 boundary, Basalt vs Slag / Asphalt / Coal, without changing analyzer
 * thresholds, index vectors, or user-facing result behavior.
 */
export const sprint40DarkConfuserFixtures: RockIdEvalFixture[] = [
  rock('s40-rock-basalt-vesicular-low-margin-a', 'Basalt', {
    color: 'Dark',
    grainSize: 'Fine',
    features: ['Vesicles', 'Rough Surface'],
    notes: 'Low-margin vesicular basalt reference for the selected dark-confuser boundary.',
  }),
  nonRock('s40-non-rock-slag-rusty-vesicular-a', 'Slag', {
    color: 'Dark',
    grainSize: 'Fine',
    features: ['Vesicles', 'Metallic Sheen', 'Rough Surface'],
    notes: 'Rusty vesicular slag fragment that can visually overlap with basalt.',
  }),
  nonRock('s40-non-rock-asphalt-wet-aggregate-a', 'Asphalt', {
    color: 'Dark',
    grainSize: 'Fine',
    features: ['Visible Aggregate', 'Wet Surface', 'Granular Texture'],
    notes: 'Wet asphalt chip with aggregate and glare; targets dark granular rock overclaim risk.',
  }),
  nonRock('s40-non-rock-coal-dull-fractured-a', 'Coal', {
    color: 'Dark',
    grainSize: 'Fine',
    features: ['Dull Surface', 'Conchoidal Fracture', 'Layered Fracture'],
    notes: 'Dull fractured coal piece near the basalt/obsidian non-rock boundary.',
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
      uri: `file:///eval/sprint40/${id}.jpg`,
      width: 1200,
      height: 900,
    },
    observations,
    createdAt: 1,
    updatedAt: 1,
    analysisMode: 'photo',
  };
}

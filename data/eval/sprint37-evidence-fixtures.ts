import type { IdentificationSession, RockObservations } from '@/lib/identification-session';
import type { RockIdEvalFixture } from '@/lib/rock-id-eval';

type FixtureInput = {
  id: string;
  expectedLabel: string;
  expectedKind?: RockIdEvalFixture['expectedKind'];
  observations: RockObservations;
};

/**
 * Sprint 37 evidence-based fixture slice.
 *
 * Sources:
 * - s37-rock-basalt-dark-vesicular-b: Basalt/Slag boundary cluster — dark vesicular samples
 *   near the non-rock proximity margin (no beta issues yet; derived from S32 gate confusion
 *   patterns and known field confuser overlap between vesicular basalt and industrial slag).
 * - s37-rock-sandstone-layered-a: New rock class added to address rock-class coverage gap;
 *   sedimentary layered sandstone commonly submitted by field testers in arid regions.
 * - s37-non-rock-asphalt-rough-a: Asphalt rough-surface variant to expand non-rock boundary
 *   coverage for dark granular materials.
 * - s37-non-rock-coal-shiny-a: Shiny coal fragment to address Obsidian/Coal confusion risk
 *   identified in S33 failure cluster analysis.
 */
export const sprint37EvidenceFixtures: RockIdEvalFixture[] = [
  rock('s37-rock-basalt-dark-vesicular-b', 'Basalt', {
    color: 'Dark',
    grainSize: 'Fine',
    features: ['Vesicles'],
    notes: 'Dark vesicular basalt sample at the slag boundary — low-margin case to exercise non-rock proximity downgrade.',
  }),
  rock('s37-rock-sandstone-layered-a', 'Sandstone', {
    color: 'Tan',
    grainSize: 'Fine',
    features: ['Visible Layers', 'Granular Texture'],
    notes: 'Layered sandstone with visible stratification; new rock class for S37 detection coverage.',
  }),
  nonRock('s37-non-rock-asphalt-rough-a', 'Asphalt', {
    color: 'Dark',
    grainSize: 'Fine',
    features: ['Rough Surface', 'Visible Aggregate'],
    notes: 'Rough asphalt chip with embedded aggregate; exercises dark granular non-rock boundary.',
  }),
  nonRock('s37-non-rock-coal-shiny-a', 'Coal', {
    color: 'Dark',
    grainSize: 'Fine',
    features: ['Shiny Surface', 'Conchoidal Fracture'],
    notes: 'Shiny coal fragment with conchoidal fracture; targets Obsidian/Coal confusion risk.',
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
      uri: `file:///eval/sprint37/${id}.jpg`,
      width: 1200,
      height: 900,
    },
    observations,
    createdAt: 1,
    updatedAt: 1,
    analysisMode: 'photo',
  };
}

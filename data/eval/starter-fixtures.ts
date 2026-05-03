import type { IdentificationSession, RockObservations } from '@/lib/identification-session';
import type { RockIdEvalFixture } from '@/lib/rock-id-eval';

type StarterFixtureInput = {
  id: string;
  expectedLabel: string;
  expectedKind?: RockIdEvalFixture['expectedKind'];
  observations: RockObservations;
  notes?: string;
};

export const starterEvalFixtures: RockIdEvalFixture[] = [
  rock('granite-coarse-light', 'Granite', {
    color: 'Light',
    grainSize: 'Coarse',
    features: ['Visible Crystals'],
    notes: 'Coarse light sample with visible quartz and feldspar-like crystals.',
  }),
  rock('granite-dark-ambiguous', 'Granite', {
    color: 'Dark',
    grainSize: 'Fine',
    features: ['Vesicles'],
    notes: 'Intentionally ambiguous starter case to expose basalt-overmatching risk.',
  }),
  rock('basalt-vesicular', 'Basalt', {
    color: 'Dark',
    grainSize: 'Fine',
    features: ['Vesicles'],
    notes: 'Dark fine-grained rock with rounded holes.',
  }),
  rock('obsidian-glassy', 'Obsidian', {
    color: 'Dark',
    grainSize: 'Glassy',
    features: ['Glassy Luster'],
    notes: 'Dark glassy volcanic-looking sample with sharp edges.',
  }),
  rock('sandstone-gritty', 'Sandstone', {
    color: 'Tan',
    grainSize: 'Medium',
    features: ['Layering'],
    notes: 'Tan gritty sample with visible sand-sized grains.',
  }),
  rock('limestone-fossil', 'Limestone', {
    color: 'Light',
    grainSize: 'Fine',
    features: ['Fossils'],
    notes: 'Light carbonate-looking sample with shell fragments.',
  }),
  rock('shale-fissile', 'Shale', {
    color: 'Dark',
    grainSize: 'Fine',
    features: ['Layering'],
    notes: 'Fine-grained sample splitting into thin sheets.',
  }),
  rock('conglomerate-rounded-clasts', 'Conglomerate', {
    color: 'Mixed',
    grainSize: 'Coarse',
    features: ['Rounded Clasts'],
    notes: 'Rounded pebbles cemented in a finer matrix.',
  }),
  rock('marble-sugary', 'Marble', {
    color: 'Light',
    grainSize: 'Coarse',
    features: ['Crystalline Texture'],
    notes: 'Sugary interlocking crystals without obvious layering.',
  }),
  rock('slate-cleavage', 'Slate', {
    color: 'Dark',
    grainSize: 'Fine',
    features: ['Flat Cleavage'],
    notes: 'Dark sample breaking along flat planar surfaces.',
  }),
  rock('gneiss-banded', 'Gneiss', {
    color: 'Mixed',
    grainSize: 'Coarse',
    features: ['Banding'],
    notes: 'Alternating light and dark mineral bands.',
  }),
  rock('quartzite-sugary', 'Quartzite', {
    color: 'Light',
    grainSize: 'Medium',
    features: ['Sugary Texture'],
    notes: 'Hard pale sample with fused sand-like texture.',
  }),
  nonRock('slag-bubbly-dark', 'Slag', {
    color: 'Dark',
    grainSize: 'Fine',
    features: ['Vesicles'],
    notes: 'Very dark bubbly material found near a rail bed.',
  }),
  nonRock('glass-shard', 'Glass', {
    color: 'Dark',
    grainSize: 'Glassy',
    features: ['Sharp Edges'],
    notes: 'Bottle-like shard with conchoidal fracture.',
  }),
  nonRock('concrete-aggregate', 'Concrete', {
    color: 'Gray',
    grainSize: 'Coarse',
    features: ['Angular Clasts'],
    notes: 'Human-made cement matrix with aggregate.',
  }),
  nonRock('brick-red-fragment', 'Brick', {
    color: 'Red',
    grainSize: 'Fine',
    features: ['Porous Texture'],
    notes: 'Fired clay fragment with uniform red color.',
  }),
];

function rock(id: string, expectedLabel: string, observations: RockObservations): RockIdEvalFixture {
  return fixture({ id, expectedLabel, observations });
}

function nonRock(id: string, expectedLabel: string, observations: RockObservations): RockIdEvalFixture {
  return fixture({ id, expectedLabel, expectedKind: 'non-rock', observations });
}

function fixture(input: StarterFixtureInput): RockIdEvalFixture {
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
      uri: `file:///eval/starter/${id}.jpg`,
      width: 1200,
      height: 900,
    },
    observations,
    createdAt: 1,
    updatedAt: 1,
  };
}

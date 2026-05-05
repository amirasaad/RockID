import type { IdentificationSession } from '@/lib/identification-session';
import type { RockIdEvalFixture } from '@/lib/rock-id-eval';

export const detectionFixtureExpansionEvalFixtures: RockIdEvalFixture[] = [
  fixture({ id: 'rock-granite-a', expectedLabel: 'Granite' }),
  fixture({ id: 'rock-granite-b', expectedLabel: 'Granite' }),
  fixture({ id: 'rock-basalt-a', expectedLabel: 'Basalt' }),
  fixture({ id: 'rock-basalt-b', expectedLabel: 'Basalt' }),
  fixture({ id: 'rock-obsidian-a', expectedLabel: 'Obsidian' }),
  fixture({ id: 'rock-obsidian-b', expectedLabel: 'Obsidian' }),
  fixture({ id: 'non-rock-slag-a', expectedLabel: 'Slag', expectedKind: 'non-rock' }),
  fixture({ id: 'non-rock-slag-b', expectedLabel: 'Slag', expectedKind: 'non-rock' }),
  fixture({ id: 'non-rock-glass-a', expectedLabel: 'Glass', expectedKind: 'non-rock' }),
  fixture({ id: 'non-rock-glass-b', expectedLabel: 'Glass', expectedKind: 'non-rock' }),
  fixture({ id: 'non-rock-asphalt-a', expectedLabel: 'Asphalt', expectedKind: 'non-rock' }),
  fixture({ id: 'non-rock-asphalt-b', expectedLabel: 'Asphalt', expectedKind: 'non-rock' }),
  fixture({ id: 'non-rock-coal-a', expectedLabel: 'Coal', expectedKind: 'non-rock' }),
  fixture({ id: 'non-rock-coal-b', expectedLabel: 'Coal', expectedKind: 'non-rock' }),
  fixture({ id: 'ambiguous-weak-evidence-a', expectedLabel: 'Granite' }),
  fixture({ id: 'ambiguous-weak-evidence-b', expectedLabel: 'Granite' }),
  fixture({ id: 'ambiguous-weak-evidence-c', expectedLabel: 'Granite' }),
];

function fixture(input: { id: string; expectedLabel: string; expectedKind?: RockIdEvalFixture['expectedKind'] }): RockIdEvalFixture {
  return {
    id: input.id,
    expectedLabel: input.expectedLabel,
    expectedKind: input.expectedKind ?? 'rock',
    session: session({ id: `session-${input.id}`, uri: `https://example.com/eval/${input.id}.jpg` }),
  };
}

function session(input: { id: string; uri: string }): IdentificationSession {
  return {
    id: input.id,
    selectedPhoto: {
      source: 'upload',
      uri: input.uri,
      width: 1200,
      height: 900,
    },
    observations: {
      color: '',
      grainSize: '',
      features: [],
      notes: '',
    },
    createdAt: 1,
    updatedAt: 1,
    analysisMode: 'photo',
  };
}

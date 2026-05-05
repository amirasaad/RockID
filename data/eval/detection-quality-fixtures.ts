import type { IdentificationSession } from '@/lib/identification-session';
import type { RockIdEvalFixture } from '@/lib/rock-id-eval';

export const detectionQualityEvalFixtures: RockIdEvalFixture[] = [
  fixture({ id: 'rock-granite', expectedLabel: 'Granite' }),
  fixture({ id: 'rock-basalt', expectedLabel: 'Basalt' }),
  fixture({ id: 'rock-obsidian', expectedLabel: 'Obsidian' }),
  fixture({ id: 'non-rock-slag', expectedLabel: 'Slag', expectedKind: 'non-rock' }),
  fixture({ id: 'ambiguous-weak-evidence', expectedLabel: 'Granite' }),
];

function fixture(input: {
  id: string;
  expectedLabel: string;
  expectedKind?: RockIdEvalFixture['expectedKind'];
}): RockIdEvalFixture {
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

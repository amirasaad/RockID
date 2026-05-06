import type { IdentificationSession } from '@/lib/identification-session';
import type { RockIdEvalFixture } from '@/lib/rock-id-eval';

export const sprint30NonRockConfuserFixtures: RockIdEvalFixture[] = [
  fixture({ id: 's30-non-rock-concrete-a', expectedLabel: 'Concrete' }),
  fixture({ id: 's30-non-rock-brick-a', expectedLabel: 'Brick' }),
  fixture({ id: 's30-non-rock-plastic-a', expectedLabel: 'Plastic' }),
  fixture({ id: 's30-non-rock-slag-ambiguous-a', expectedLabel: 'Slag' }),
  fixture({ id: 's30-non-rock-glass-ambiguous-a', expectedLabel: 'Glass' }),
];

function fixture(input: { id: string; expectedLabel: string }): RockIdEvalFixture {
  return {
    id: input.id,
    expectedLabel: input.expectedLabel,
    expectedKind: 'non-rock',
    session: session({ id: `session-${input.id}`, uri: `https://example.com/eval/${input.id}.jpg` }),
  };
}

function notesFor(id: string): string {
  const noteById: Record<string, string> = {
    's30-non-rock-concrete-a': 'Gray cement matrix with coarse aggregate fragments.',
    's30-non-rock-brick-a': 'Reddish fired clay texture with uniform grain.',
    's30-non-rock-plastic-a': 'Synthetic sheen and molded edges unlike mineral fracture.',
    's30-non-rock-slag-ambiguous-a': 'Dark bubbly industrial residue with irregular vesicles.',
    's30-non-rock-glass-ambiguous-a': 'Sharp reflective shard showing conchoidal fracture patterns.',
  };

  return noteById[id] ?? 'Curated non-rock confuser sample for safety eval.';
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
      notes: notesFor(input.id),
    },
    createdAt: 1,
    updatedAt: 1,
    analysisMode: 'photo',
  };
}

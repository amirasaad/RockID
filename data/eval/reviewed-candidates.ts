import type { RockIdEvalFixture } from '@/lib/rock-id-eval';

type ReviewedDecision = 'fixture_add' | 'fixture_update' | 'no_action' | 'pending';

export type ReviewedEvalCandidate = {
  id: string;
  reviewDecision: ReviewedDecision;
  expectedLabel: string;
  expectedKind: RockIdEvalFixture['expectedKind'];
  source: string;
  license: string;
  notes: string;
  session: {
    photoUri: string;
    observations: {
      color: string;
      grainSize: string;
      features: string[];
      notes: string;
    };
  };
};

export function createEvalFixturesFromReviewedCandidates(candidates: ReviewedEvalCandidate[]): RockIdEvalFixture[] {
  return candidates
    .filter((candidate) => candidate.reviewDecision === 'fixture_add' || candidate.reviewDecision === 'fixture_update')
    .map((candidate) => ({
      id: candidate.id,
      expectedLabel: candidate.expectedLabel,
      expectedKind: candidate.expectedKind,
      session: {
        id: `session-${candidate.id}`,
        selectedPhoto: {
          source: 'upload',
          uri: candidate.session.photoUri,
          width: 1200,
          height: 900,
        },
        observations: {
          color: candidate.session.observations.color,
          grainSize: candidate.session.observations.grainSize,
          features: candidate.session.observations.features,
          notes: candidate.session.observations.notes,
        },
        createdAt: 1,
        updatedAt: 1,
      },
    }));
}

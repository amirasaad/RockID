import type { RockIdEvalFixture } from '@/lib/rock-id-eval';

type ReviewedDecision = 'fixture_add' | 'fixture_update' | 'no_action' | 'pending';

const REVIEWABLE_DECISIONS: ReadonlySet<ReviewedDecision> = new Set(['fixture_add', 'fixture_update']);
const DEFAULT_PHOTO_WIDTH = 1200;
const DEFAULT_PHOTO_HEIGHT = 900;
const DEFAULT_TIMESTAMP = 1;

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
    .filter(isReviewedForFixtureCuration)
    .map(toEvalFixture);
}

function isReviewedForFixtureCuration(candidate: ReviewedEvalCandidate): boolean {
  return REVIEWABLE_DECISIONS.has(candidate.reviewDecision);
}

function toEvalFixture(candidate: ReviewedEvalCandidate): RockIdEvalFixture {
  return {
    id: candidate.id,
    expectedLabel: candidate.expectedLabel,
    expectedKind: candidate.expectedKind,
    session: {
      id: `session-${candidate.id}`,
      selectedPhoto: {
        source: 'upload',
        uri: candidate.session.photoUri,
        width: DEFAULT_PHOTO_WIDTH,
        height: DEFAULT_PHOTO_HEIGHT,
      },
      observations: {
        color: candidate.session.observations.color,
        grainSize: candidate.session.observations.grainSize,
        features: candidate.session.observations.features,
        notes: candidate.session.observations.notes,
      },
      createdAt: DEFAULT_TIMESTAMP,
      updatedAt: DEFAULT_TIMESTAMP,
    },
  };
}

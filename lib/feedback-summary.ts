import type { ResultFeedback } from './result-feedback';

type FeedbackChoiceSummary = {
  useful: number;
  uncertain: number;
  wrong: number;
};

type FeedbackConfidenceSummary = {
  Low: number;
  Medium: number;
  High: number;
  Unknown: number;
};

export type FeedbackReviewCandidate = {
  sessionId: string;
  choice: 'uncertain' | 'wrong';
  confidence: 'Low' | 'Medium' | 'High' | 'Unknown';
  topMatch: string;
  engine: string;
  note?: string;
  recordedAt: number;
};

export type FeedbackSummary = {
  total: number;
  byChoice: FeedbackChoiceSummary;
  byConfidence: FeedbackConfidenceSummary;
  reviewCandidates: FeedbackReviewCandidate[];
};

function toConfidenceLabel(input: ResultFeedback): 'Low' | 'Medium' | 'High' | 'Unknown' {
  return input.analysisContext?.confidence ?? 'Unknown';
}

export function createFeedbackSummary(feedback: ResultFeedback[]): FeedbackSummary {
  const byChoice: FeedbackChoiceSummary = {
    useful: 0,
    uncertain: 0,
    wrong: 0,
  };

  const byConfidence: FeedbackConfidenceSummary = {
    Low: 0,
    Medium: 0,
    High: 0,
    Unknown: 0,
  };

  for (const item of feedback) {
    if (item.choice === 'useful') byChoice.useful += 1;
    if (item.choice === 'uncertain') byChoice.uncertain += 1;
    if (item.choice === 'wrong') byChoice.wrong += 1;

    const confidence = toConfidenceLabel(item);
    byConfidence[confidence] += 1;
  }

  const reviewCandidates = feedback
    .filter((item): item is ResultFeedback & { choice: 'uncertain' | 'wrong' } => item.choice === 'uncertain' || item.choice === 'wrong')
    .sort((left, right) => right.recordedAt - left.recordedAt)
    .map((item) => ({
      sessionId: item.sessionId,
      choice: item.choice,
      confidence: toConfidenceLabel(item),
      topMatch: item.analysisContext?.topMatch ?? 'Unknown',
      engine: item.analysisContext?.diagnostics.engine ?? 'unknown',
      note: item.note,
      recordedAt: item.recordedAt,
    }));

  return {
    total: feedback.length,
    byChoice,
    byConfidence,
    reviewCandidates,
  };
}

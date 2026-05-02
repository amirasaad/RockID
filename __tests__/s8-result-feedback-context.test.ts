import { describe, expect, it } from 'vitest';

import { createResultFeedbackRepository } from '@/lib/result-feedback-context';

describe('S8 result feedback repository', () => {
  it('saves feedback and reads it by session', () => {
    const repo = createResultFeedbackRepository();

    const saved = repo.saveFeedback({
      sessionId: 'sess-1',
      choice: 'useful',
      recordedAt: 1_777_680_000_000,
    });

    expect(saved).toEqual({
      id: 'feedback-sess-1',
      sessionId: 'sess-1',
      choice: 'useful',
      recordedAt: 1_777_680_000_000,
    });
    expect(repo.getFeedbackForSession('sess-1')).toEqual(saved);
  });

  it('keeps the latest feedback for a session id', () => {
    const repo = createResultFeedbackRepository();

    repo.saveFeedback({
      sessionId: 'sess-1',
      choice: 'useful',
      recordedAt: 1_777_680_000_000,
    });
    const latest = repo.saveFeedback({
      sessionId: 'sess-1',
      choice: 'not_useful',
      recordedAt: 1_777_680_100_000,
    });

    expect(repo.getSnapshot().feedback).toEqual([latest]);
    expect(repo.getFeedbackForSession('sess-1')).toEqual(latest);
  });
});

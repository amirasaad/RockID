import { describe, expect, it } from 'vitest';

import {
  createResultFeedbackStore,
  recordResultFeedback,
  type ResultFeedbackChoice,
} from '@/lib/result-feedback';

describe('S8 result feedback', () => {
  it('records whether a completed result was useful for field-test learning', () => {
    const store = createResultFeedbackStore();
    const choice: ResultFeedbackChoice = 'useful';

    const feedback = recordResultFeedback({
      sessionId: 'sess-field-test-1',
      choice,
      saveFeedback: store.save,
      recordedAt: 1_777_680_000_000,
    });

    expect(feedback).toEqual({
      id: 'feedback-sess-field-test-1',
      sessionId: 'sess-field-test-1',
      choice: 'useful',
      recordedAt: 1_777_680_000_000,
    });
    expect(store.getSnapshot().feedback).toEqual([feedback]);
  });

  it('keeps the latest feedback choice for a session', () => {
    const store = createResultFeedbackStore();

    recordResultFeedback({
      sessionId: 'sess-field-test-1',
      choice: 'useful',
      saveFeedback: store.save,
      recordedAt: 1_777_680_000_000,
    });
    const updated = recordResultFeedback({
      sessionId: 'sess-field-test-1',
      choice: 'not_useful',
      saveFeedback: store.save,
      recordedAt: 1_777_680_100_000,
    });

    expect(store.getSnapshot().feedback).toEqual([updated]);
  });
});

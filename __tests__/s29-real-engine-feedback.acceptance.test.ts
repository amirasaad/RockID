import { describe, expect, it } from 'vitest';

import {
  createResultFeedbackStore,
  recordResultFeedback,
} from '@/lib/result-feedback';

describe('S29 real-engine feedback acceptance', () => {
  it('captures wrong or uncertain feedback with analysis context for field QA', () => {
    const store = createResultFeedbackStore();

    const feedback = recordResultFeedback({
      sessionId: 'sess-real-engine-feedback-1',
      choice: 'wrong',
      note: 'Looks more like slag than basalt in person.',
      analysisContext: {
        topMatch: 'Basalt',
        confidence: 'Low',
        diagnostics: {
          engine: 'photoOnDeviceEncoder',
          fallback: false,
          durationMs: 842,
        },
      },
      saveFeedback: store.save,
      recordedAt: 1_777_690_000_000,
    });

    expect(feedback).toEqual({
      id: 'feedback-sess-real-engine-feedback-1',
      sessionId: 'sess-real-engine-feedback-1',
      choice: 'wrong',
      note: 'Looks more like slag than basalt in person.',
      analysisContext: {
        topMatch: 'Basalt',
        confidence: 'Low',
        diagnostics: {
          engine: 'photoOnDeviceEncoder',
          fallback: false,
          durationMs: 842,
        },
      },
      recordedAt: 1_777_690_000_000,
    });
    expect(store.getSnapshot().feedback).toEqual([feedback]);
  });
});

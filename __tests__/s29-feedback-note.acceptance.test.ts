import { describe, expect, it } from 'vitest';

import { createResultFeedbackStore, recordResultFeedback } from '@/lib/result-feedback';

describe('S29 feedback note acceptance', () => {
  it('normalizes blank notes so review candidates keep meaningful text only', () => {
    const store = createResultFeedbackStore();

    const feedback = recordResultFeedback({
      sessionId: 'sess-s29-note-1',
      choice: 'uncertain',
      note: '   ',
      analysisContext: {
        topMatch: 'Basalt',
        confidence: 'Low',
        diagnostics: {
          engine: 'photoOnDeviceEncoder',
          fallback: false,
          durationMs: 612,
        },
      },
      saveFeedback: store.save,
      recordedAt: 1_777_700_000_000,
    });

    expect(feedback.note).toBeUndefined();
    expect(store.getSnapshot().feedback[0]?.note).toBeUndefined();
  });
});

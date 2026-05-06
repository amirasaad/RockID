import { describe, expect, it } from 'vitest';

import { createFeedbackSummary } from '@/lib/feedback-summary';
import type { ResultFeedback } from '@/lib/result-feedback';

describe('S29 feedback summary', () => {
  it('groups local real-engine feedback by confidence and issue type', () => {
    const feedback: ResultFeedback[] = [
      {
        id: 'feedback-1',
        sessionId: 'sess-1',
        choice: 'uncertain',
        analysisContext: {
          topMatch: 'Basalt',
          confidence: 'Low',
          diagnostics: { engine: 'photoOnDeviceEncoder', fallback: false, durationMs: 420 },
        },
        recordedAt: 1_777_700_000_001,
      },
      {
        id: 'feedback-2',
        sessionId: 'sess-2',
        choice: 'wrong',
        note: 'Looked like slag on site',
        analysisContext: {
          topMatch: 'Granite',
          confidence: 'High',
          diagnostics: { engine: 'photoBytesPreview', fallback: false, durationMs: 390 },
        },
        recordedAt: 1_777_700_000_002,
      },
      {
        id: 'feedback-3',
        sessionId: 'sess-3',
        choice: 'useful',
        analysisContext: {
          topMatch: 'Limestone',
          confidence: 'Medium',
          diagnostics: { engine: 'detailsMock', fallback: false, durationMs: 0 },
        },
        recordedAt: 1_777_700_000_003,
      },
    ];

    expect(createFeedbackSummary(feedback)).toEqual({
      total: 3,
      byChoice: {
        useful: 1,
        uncertain: 1,
        wrong: 1,
      },
      byConfidence: {
        Low: 1,
        Medium: 1,
        High: 1,
        Unknown: 0,
      },
      reviewCandidates: [
        {
          sessionId: 'sess-2',
          choice: 'wrong',
          confidence: 'High',
          topMatch: 'Granite',
          engine: 'photoBytesPreview',
          note: 'Looked like slag on site',
          recordedAt: 1_777_700_000_002,
        },
        {
          sessionId: 'sess-1',
          choice: 'uncertain',
          confidence: 'Low',
          topMatch: 'Basalt',
          engine: 'photoOnDeviceEncoder',
          note: undefined,
          recordedAt: 1_777_700_000_001,
        },
      ],
    });
  });
});

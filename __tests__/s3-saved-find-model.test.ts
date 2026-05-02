import { describe, expect, it } from 'vitest';

import type { IdentificationSession } from '@/lib/identification-session';
import type { MockAnalysisResult } from '@/lib/mock-analysis';
import { createSavedFind } from '@/lib/saved-finds';

describe('S3 saved find model', () => {
  it('creates a saved find from the current identification session and analysis result', () => {
    const session: IdentificationSession = {
      id: 'session-granite-save',
      selectedPhoto: {
        source: 'camera',
        uri: 'file:///field/granite-save.jpg',
        width: 1200,
        height: 900,
      },
      observations: {
        color: 'Light',
        grainSize: 'Coarse',
        features: ['Quartz', 'Feldspar'],
        notes: 'Found near the trailhead.',
      },
      createdAt: 1,
      updatedAt: 2,
    };

    const analysis: MockAnalysisResult = {
      sessionId: 'session-granite-save',
      imageUri: 'file:///field/granite-save.jpg',
      topMatch: {
        name: 'Granite',
        category: 'Igneous intrusive',
        confidence: 'Medium',
        score: 72,
      },
      matches: [
        {
          name: 'Granite',
          category: 'Igneous intrusive',
          confidence: 'Medium',
          score: 72,
        },
      ],
      reasoning: 'Coarse grains point toward granite.',
      nextCheck: 'Look for foliation.',
    };

    const savedFind = createSavedFind({
      session,
      analysis,
      savedAt: 1_774_000_000_000,
    });

    expect(savedFind).toEqual({
      id: 'find-session-granite-save',
      sessionId: 'session-granite-save',
      imageUri: 'file:///field/granite-save.jpg',
      title: 'Granite',
      confidence: 'Medium',
      notes: 'Found near the trailhead.',
      savedAt: 1_774_000_000_000,
      topMatch: analysis.topMatch,
      matches: analysis.matches,
    });
    expect(savedFind.matches).not.toBe(analysis.matches);
  });
});

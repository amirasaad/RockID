import { describe, expect, it } from 'vitest';

import { analyzeIdentificationSession } from '@/lib/mock-analysis';
import type { IdentificationSession } from '@/lib/identification-session';

describe('S2 mock analysis acceptance', () => {
  it('returns a typed analysis result using selected image and observations from the session', () => {
    const session: IdentificationSession = {
      id: 'session-basalt-field-test',
      selectedPhoto: {
        source: 'camera',
        uri: 'file:///field/basalt.jpg',
        width: 1200,
        height: 1600,
      },
      observations: {
        color: 'Dark',
        grainSize: 'Fine',
        features: ['Vesicles'],
        notes: 'Very dark with small holes and fine texture.',
      },
      createdAt: 1,
      updatedAt: 1,
    };

    const analysis = analyzeIdentificationSession(session);

    expect(analysis.sessionId).toBe('session-basalt-field-test');
    expect(analysis.imageUri).toBe('file:///field/basalt.jpg');
    expect(analysis.topMatch).toEqual(
      expect.objectContaining({
        name: 'Basalt',
        category: 'Igneous volcanic',
        confidence: 'High',
      })
    );
    expect(analysis.matches).toHaveLength(3);
    expect(analysis.reasoning).toContain('fine grain');
    expect(analysis.nextCheck).toContain('vesicles');
  });

  it('returns a low-confidence result with uncertainty-focused copy when evidence is weak', () => {
    const session: IdentificationSession = {
      id: 'session-weak-evidence',
      selectedPhoto: {
        source: 'upload',
        uri: 'file:///field/unclear-sample.jpg',
        width: 900,
        height: 900,
      },
      observations: {
        color: '',
        grainSize: '',
        features: [],
        notes: '',
      },
      createdAt: 1,
      updatedAt: 1,
    };

    const analysis = analyzeIdentificationSession(session);

    expect(analysis.topMatch.confidence).toBe('Low');
    expect(analysis.matches).toHaveLength(3);
    expect(analysis.reasoning).toContain('not enough evidence');
    expect(analysis.nextCheck).toContain('add a clearer photo');
  });
});

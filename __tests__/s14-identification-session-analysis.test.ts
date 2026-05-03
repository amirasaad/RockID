import { describe, expect, it } from 'vitest';

import { createIdentificationSessionStore, type IdentificationAnalysis } from '@/lib/identification-session';

describe('S14 identification session store analysis', () => {
  it('stores analysis and clears it when session inputs change', () => {
    const store = createIdentificationSessionStore();

    const session = store.startSession({ source: 'upload', uri: 'file:///field/example.jpg', width: 100, height: 100 });
    const analysis: IdentificationAnalysis = {
      sessionId: session.id,
      imageUri: session.selectedPhoto?.uri,
      matches: [
        { name: 'Granite', category: 'Rock', confidence: 'High', score: 90 },
        { name: 'Basalt', category: 'Rock', confidence: 'Low', score: 10 },
      ],
      topMatch: { name: 'Granite', category: 'Rock', confidence: 'High', score: 90 },
      reasoning: 'Because reasons.',
      nextCheck: 'Check again.',
    };

    store.setAnalysis(analysis);
    expect(store.getSnapshot().analysis).toEqual(analysis);

    store.setObservations({ color: 'Light', grainSize: 'Coarse', features: [], notes: '' });
    expect(store.getSnapshot().analysis).toBeNull();

    store.setAnalysis(analysis);
    store.setSelectedPhoto({ source: 'camera', uri: 'file:///field/other.jpg', width: 100, height: 100 });
    expect(store.getSnapshot().analysis).toBeNull();
  });

  it('clears analysis on reset', () => {
    const store = createIdentificationSessionStore();
    const session = store.startSession({ source: 'upload', uri: 'file:///field/example.jpg' });
    store.setAnalysis({
      sessionId: session.id,
      imageUri: session.selectedPhoto?.uri,
      matches: [{ name: 'Granite', category: 'Rock', confidence: 'High', score: 90 }],
      topMatch: { name: 'Granite', category: 'Rock', confidence: 'High', score: 90 },
      reasoning: 'Because reasons.',
      nextCheck: 'Check again.',
    });

    store.reset();
    expect(store.getSnapshot().analysis).toBeNull();
    expect(store.getSnapshot().session).toBeNull();
  });
});


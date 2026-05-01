import { describe, expect, it } from 'vitest';

import { createIdentificationSessionStore } from '@/lib/identification-session';

describe('S2 session state acceptance', () => {
  it('carries selected photo and observations through a single in-memory identification session', () => {
    const store = createIdentificationSessionStore();

    const session = store.startSession({
      source: 'camera',
      uri: 'file:///field/basalt.jpg',
      width: 1200,
      height: 1600,
    });

    expect(session.id).toEqual(expect.any(String));
    expect(store.getSnapshot().session?.selectedPhoto?.uri).toBe('file:///field/basalt.jpg');

    store.setObservations({
      color: 'Dark',
      grainSize: 'Fine',
      features: ['Vesicles'],
      notes: 'Very dark with small holes and fine texture.',
    });

    expect(store.getSnapshot().session).toEqual(
      expect.objectContaining({
        id: session.id,
        selectedPhoto: expect.objectContaining({
          source: 'camera',
          uri: 'file:///field/basalt.jpg',
        }),
        observations: expect.objectContaining({
          color: 'Dark',
          grainSize: 'Fine',
          features: ['Vesicles'],
        }),
      })
    );
  });
});


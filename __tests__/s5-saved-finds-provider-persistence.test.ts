import { describe, expect, it } from 'vitest';

import type { SavedFind } from '@/lib/saved-finds';
import { createSavedFindStore } from '@/lib/saved-finds';
import { createPersistedSavedFindStore, createTestKeyValueStorage } from '@/lib/saved-finds-persistence';

describe('S5 saved finds persistence unit', () => {
  it('hydrates an in-memory saved-find store from storage and persists on save', async () => {
    const storage = createTestKeyValueStorage();
    const existing: SavedFind = {
      id: 'find-sess-1',
      sessionId: 'sess-1',
      imageUri: 'file:///field/one.jpg',
      title: 'Granite',
      confidence: 'Medium',
      notes: 'Existing note',
      savedAt: 1_777_680_000_000,
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
    };

    await storage.setItem('rockid.savedFinds.v1', JSON.stringify([existing]));

    const baseStore = createSavedFindStore();
    const persisted = createPersistedSavedFindStore({ store: baseStore, storage });

    await persisted.hydrate();
    expect(baseStore.getSnapshot().savedFinds).toEqual([existing]);

    const next: SavedFind = {
      ...existing,
      id: 'find-sess-2',
      sessionId: 'sess-2',
      savedAt: 1_777_680_000_100,
    };
    baseStore.save(next);

    await persisted.flush();
    const reloaded = await storage.getItem('rockid.savedFinds.v1');
    expect(JSON.parse(reloaded ?? 'null')).toEqual([next, existing]);
  });
});

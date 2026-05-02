import { describe, expect, it } from 'vitest';

import type { SavedFind } from '@/lib/saved-finds';
import { createSavedFindStore } from '@/lib/saved-finds';

describe('S3 saved find store', () => {
  it('saves records and returns the newest saved find first', () => {
    const store = createSavedFindStore();
    const olderFind = savedFind({ id: 'older-find', savedAt: 100 });
    const newerFind = savedFind({ id: 'newer-find', savedAt: 200 });

    store.save(olderFind);
    store.save(newerFind);

    expect(store.getSnapshot()).toEqual({
      savedFinds: [newerFind, olderFind],
    });
  });

  it('replaces an existing saved find with the same id', () => {
    const store = createSavedFindStore();
    const originalFind = savedFind({ id: 'same-find', savedAt: 100 });
    const updatedFind = { ...originalFind, notes: 'Updated field note.', savedAt: 200 };

    store.save(originalFind);
    store.save(updatedFind);

    expect(store.getSnapshot()).toEqual({
      savedFinds: [updatedFind],
    });
  });
});

function savedFind(overrides: Pick<SavedFind, 'id' | 'savedAt'>): SavedFind {
  return {
    id: overrides.id,
    sessionId: `session-${overrides.id}`,
    imageUri: `file:///field/${overrides.id}.jpg`,
    title: 'Granite',
    confidence: 'Medium',
    notes: '',
    savedAt: overrides.savedAt,
    topMatch: {
      name: 'Granite',
      category: 'Igneous intrusive',
      confidence: 'Medium',
      score: 72,
    },
    matches: [],
  };
}

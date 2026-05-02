import { describe, expect, it } from 'vitest';

import { createSavedFindsRepository } from '@/lib/saved-finds-context';
import type { SavedFind } from '@/lib/saved-finds';
import { createTestKeyValueStorage } from '@/lib/saved-finds-persistence';

describe('S5 saved finds context persistence unit', () => {
  it('hydrates then persists saves through the repository', async () => {
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

    const repo = createSavedFindsRepository({ storage });
    await repo.hydrate();
    expect(repo.getSnapshot().savedFinds).toEqual([existing]);

    const next: SavedFind = { ...existing, id: 'find-sess-2', sessionId: 'sess-2', savedAt: 1_777_680_000_100 };
    repo.saveFind(next);
    await repo.flush();

    const raw = await storage.getItem('rockid.savedFinds.v1');
    expect(JSON.parse(raw ?? 'null')).toEqual([next, existing]);
  });
});

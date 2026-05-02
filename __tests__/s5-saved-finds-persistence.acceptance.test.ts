import { describe, expect, it } from 'vitest';

import type { IdentificationSession } from '@/lib/identification-session';
import { analyzeIdentificationSession } from '@/lib/mock-analysis';
import { createSavedFind } from '@/lib/saved-finds';
import { createSavedFindStoreWithPersistence, createTestKeyValueStorage } from '@/lib/saved-finds-persistence';

describe('S5 saved finds persistence acceptance', () => {
  it('re-hydrates saved finds after a simulated app restart', async () => {
    const storage = createTestKeyValueStorage();

    const storeA = await createSavedFindStoreWithPersistence({ storage });
    const session = sampleSession();
    const savedFind = createSavedFind({ session, analysis: analyzeIdentificationSession(session) });
    storeA.save(savedFind);

    const storeB = await createSavedFindStoreWithPersistence({ storage });
    expect(storeB.getSnapshot().savedFinds).toEqual([savedFind]);
  });
});

function sampleSession(): IdentificationSession {
  return {
    id: 'sess-persist-001',
    selectedPhoto: {
      source: 'upload',
      uri: 'file:///field/granite.jpg',
      width: 1200,
      height: 900,
    },
    observations: {
      color: 'Light',
      grainSize: 'Coarse',
      features: ['Visible Crystals'],
      notes: 'Field note',
    },
    createdAt: 1_777_680_000_000,
    updatedAt: 1_777_680_000_000,
  };
}

import { describe, expect, it } from 'vitest';

import type { IdentificationSession } from '@/lib/identification-session';
import { analyzeIdentificationSession } from '@/lib/mock-analysis';
import type { SavedFind } from '@/lib/saved-finds';
import { createSavedFindStore } from '@/lib/saved-finds';
import { saveIdentificationResultAsync } from '@/lib/saved-finds-actions';

describe('S3 save result acceptance', () => {
  it('saves the current analysis result and returns an id that can be opened in the saved find detail route', async () => {
    const store = createSavedFindStore();
    const session = sampleSession();
    const analysis = analyzeIdentificationSession(session);

    const savedFind = await saveIdentificationResultAsync({
      session,
      analysis,
      saveFind: store.save,
      savePhotosLocally: true,
      persistPhotoUri: async ({ photoUri }) => photoUri,
    });

    expect(savedFind.id).toBe(`find-${session.id}`);
    expect(store.getSnapshot().savedFinds.find((find) => find.id === savedFind.id)).toEqual(savedFind);
  });
});

function sampleSession(): IdentificationSession {
  return {
    id: 'sess-qa-123',
    selectedPhoto: {
      source: 'upload',
      uri: 'file:///field/quartzite.jpg',
      width: 1200,
      height: 900,
    },
    observations: {
      color: 'Light',
      grainSize: 'Coarse',
      features: ['Visible Crystals'],
      notes: 'Coarse grains, light color.',
    },
    createdAt: 1_777_680_000_000,
    updatedAt: 1_777_680_000_000,
  };
}

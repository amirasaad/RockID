import { describe, expect, it } from 'vitest';

import type { SavedFind } from '@/lib/saved-finds';
import { createSavedFindDetailViewModel } from '@/lib/saved-find-detail-view-model';

describe('S3-4 saved find detail acceptance', () => {
  it('returns a missing-image view model when the saved find has no image URI', () => {
    const savedFind = savedFindFactory({ id: 'find-missing', imageUri: undefined });

    const viewModel = createSavedFindDetailViewModel(savedFind);

    expect(viewModel.preview).toEqual({
      kind: 'missing-image',
      fallbackText: 'Photo missing',
    });
  });
});

function savedFindFactory(overrides: Pick<SavedFind, 'id' | 'imageUri'>): SavedFind {
  return {
    id: overrides.id,
    sessionId: `session-${overrides.id}`,
    imageUri: overrides.imageUri,
    title: 'Granite near trail',
    confidence: 'Medium',
    notes: 'Found near a dry stream bed.',
    savedAt: 1_777_680_000_000,
    topMatch: {
      name: 'Granite',
      category: 'Igneous intrusive',
      confidence: 'Medium',
      score: 72,
    },
    matches: [],
  };
}


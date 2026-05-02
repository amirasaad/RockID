import { describe, expect, it } from 'vitest';

import type { SavedFind } from '@/lib/saved-finds';
import { createCollectionViewModel } from '@/lib/collection-view-model';

describe('S3-3 collection acceptance', () => {
  it('includes thumbnail data for saved finds and flags missing images for graceful rendering', () => {
    const withImage = savedFind({ id: 'with-image', imageUri: 'file:///field/with-image.jpg', savedAt: 200 });
    const missingImage = savedFind({ id: 'missing-image', imageUri: undefined, savedAt: 100 });

    const viewModel = createCollectionViewModel([missingImage, withImage]);

    expect(viewModel).toEqual({
      kind: 'populated',
      items: [
        {
          id: 'with-image',
          title: 'Granite',
          confidenceLabel: 'Medium confidence',
          savedAtLabel: 'Saved Jan 1, 1970',
          imageUri: 'file:///field/with-image.jpg',
          hasImage: true,
        },
        {
          id: 'missing-image',
          title: 'Granite',
          confidenceLabel: 'Medium confidence',
          savedAtLabel: 'Saved Jan 1, 1970',
          imageUri: undefined,
          hasImage: false,
        },
      ],
    });
  });
});

function savedFind(overrides: Pick<SavedFind, 'id' | 'imageUri' | 'savedAt'>): SavedFind {
  return {
    id: overrides.id,
    sessionId: `session-${overrides.id}`,
    imageUri: overrides.imageUri,
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


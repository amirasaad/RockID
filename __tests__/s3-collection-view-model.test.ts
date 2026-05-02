import { describe, expect, it } from 'vitest';

import type { SavedFind } from '@/lib/saved-finds';
import { createCollectionViewModel } from '@/lib/collection-view-model';

describe('S3 collection view model', () => {
  it('returns an empty state when there are no saved finds', () => {
    const viewModel = createCollectionViewModel([]);

    expect(viewModel).toEqual({
      kind: 'empty',
      title: 'No saved rocks yet',
      message: 'Save an identification result to build your field collection.',
      items: [],
    });
  });

  it('maps saved finds to newest-first collection rows', () => {
    const olderFind = savedFind({ id: 'older-find', title: 'Granite', confidence: 'Medium', savedAt: 100 });
    const newerFind = savedFind({ id: 'newer-find', title: 'Basalt', confidence: 'High', savedAt: 1_777_680_000_000 });

    const viewModel = createCollectionViewModel([olderFind, newerFind]);

    expect(viewModel).toEqual({
      kind: 'populated',
      items: [
        {
          id: 'newer-find',
          title: 'Basalt',
          confidenceLabel: 'High confidence',
          savedAtLabel: 'Saved May 2, 2026',
          imageUri: 'file:///field/newer-find.jpg',
          hasImage: true,
        },
        {
          id: 'older-find',
          title: 'Granite',
          confidenceLabel: 'Medium confidence',
          savedAtLabel: 'Saved Jan 1, 1970',
          imageUri: 'file:///field/older-find.jpg',
          hasImage: true,
        },
      ],
    });
  });
});

function savedFind(overrides: Pick<SavedFind, 'id' | 'title' | 'confidence' | 'savedAt'>): SavedFind {
  return {
    id: overrides.id,
    sessionId: `session-${overrides.id}`,
    imageUri: `file:///field/${overrides.id}.jpg`,
    title: overrides.title,
    confidence: overrides.confidence,
    notes: '',
    savedAt: overrides.savedAt,
    topMatch: {
      name: overrides.title,
      category: 'Igneous',
      confidence: overrides.confidence,
      score: 72,
    },
    matches: [],
  };
}

import { describe, expect, it } from 'vitest';

import type { SavedFind } from '@/lib/saved-finds';
import { createCollectionViewModel } from '@/lib/collection-view-model';

describe('S19 collection search + filter', () => {
  it('filters by query across title, top match name, and category', () => {
    const granite = savedFind({ id: 'granite', title: 'Granite', topMatchName: 'Granite', topMatchCategory: 'Igneous intrusive', savedAt: 300 });
    const basalt = savedFind({ id: 'basalt', title: 'Basalt sample', topMatchName: 'Basalt', topMatchCategory: 'Igneous extrusive', savedAt: 200 });
    const shale = savedFind({ id: 'shale', title: 'Field note', topMatchName: 'Shale', topMatchCategory: 'Sedimentary', savedAt: 100 });

    expect(createCollectionViewModel([granite, basalt, shale], { query: 'bas', filter: 'All' })).toEqual({
      kind: 'populated',
      items: [
        {
          id: 'basalt',
          title: 'Basalt sample',
          categoryLabel: 'Igneous extrusive',
          confidenceLabel: 'Medium confidence',
          savedAtLabel: 'Saved Jan 1, 1970',
          imageUri: undefined,
          hasImage: false,
        },
      ],
    });

    expect(createCollectionViewModel([granite, basalt, shale], { query: 'sedimentary', filter: 'All' })).toEqual({
      kind: 'populated',
      items: [
        {
          id: 'shale',
          title: 'Field note',
          categoryLabel: 'Sedimentary',
          confidenceLabel: 'Medium confidence',
          savedAtLabel: 'Saved Jan 1, 1970',
          imageUri: undefined,
          hasImage: false,
        },
      ],
    });
  });

  it('filters by rock group chip and by low-confidence chip', () => {
    const igneousLow = savedFind({
      id: 'igneous-low',
      topMatchCategory: 'Igneous intrusive',
      confidence: 'Low',
      savedAt: 300,
    });
    const sedimentaryLow = savedFind({
      id: 'sedimentary-low',
      topMatchCategory: 'Sedimentary',
      confidence: 'Low',
      savedAt: 200,
    });
    const metamorphicHigh = savedFind({
      id: 'metamorphic-high',
      topMatchCategory: 'Metamorphic',
      confidence: 'High',
      savedAt: 100,
    });

    expect(createCollectionViewModel([igneousLow, sedimentaryLow, metamorphicHigh], { filter: 'Igneous' })).toEqual({
      kind: 'populated',
      items: [
        {
          id: 'igneous-low',
          title: 'Granite',
          categoryLabel: 'Igneous intrusive',
          confidenceLabel: 'Low confidence',
          savedAtLabel: 'Saved Jan 1, 1970',
          imageUri: undefined,
          hasImage: false,
        },
      ],
    });

    expect(createCollectionViewModel([igneousLow, sedimentaryLow, metamorphicHigh], { filter: 'Low confidence' })).toEqual({
      kind: 'populated',
      items: [
        {
          id: 'igneous-low',
          title: 'Granite',
          categoryLabel: 'Igneous intrusive',
          confidenceLabel: 'Low confidence',
          savedAtLabel: 'Saved Jan 1, 1970',
          imageUri: undefined,
          hasImage: false,
        },
        {
          id: 'sedimentary-low',
          title: 'Granite',
          categoryLabel: 'Sedimentary',
          confidenceLabel: 'Low confidence',
          savedAtLabel: 'Saved Jan 1, 1970',
          imageUri: undefined,
          hasImage: false,
        },
      ],
    });
  });

  it('returns an empty-search state when filters yield no results', () => {
    const granite = savedFind({ id: 'granite', topMatchCategory: 'Igneous intrusive', savedAt: 100 });

    expect(createCollectionViewModel([granite], { query: 'does-not-match', filter: 'All' })).toEqual({
      kind: 'empty',
      title: 'No results found',
      message: 'Try a different search or filter.',
      items: [],
    });
  });
});

/**
 * Builds a SavedFind test fixture with sensible defaults and optional overrides.
 */
function savedFind(
  overrides: Partial<
    Pick<SavedFind, 'id' | 'imageUri' | 'savedAt' | 'title' | 'confidence'> & {
      topMatchName: string;
      topMatchCategory: string;
    }
  > & { id: string }
): SavedFind {
  return {
    id: overrides.id,
    sessionId: `session-${overrides.id}`,
    imageUri: overrides.imageUri,
    title: overrides.title ?? 'Granite',
    confidence: overrides.confidence ?? 'Medium',
    notes: '',
    savedAt: overrides.savedAt ?? 100,
    topMatch: {
      name: overrides.topMatchName ?? 'Granite',
      category: overrides.topMatchCategory ?? 'Igneous intrusive',
      confidence: overrides.confidence ?? 'Medium',
      score: 72,
    },
    matches: [],
  };
}

import type { SavedFind } from './saved-finds';

export type CollectionItemViewModel = {
  id: string;
  title: string;
  categoryLabel: string;
  confidenceLabel: string;
  savedAtLabel: string;
  imageUri?: string;
  hasImage: boolean;
};

export type EmptyCollectionViewModel = {
  kind: 'empty';
  title: string;
  message: string;
  action: EmptyCollectionAction;
  items: CollectionItemViewModel[];
};

export type EmptyCollectionAction =
  | { kind: 'identify'; label: string }
  | { kind: 'reset'; label: string };

export type PopulatedCollectionViewModel = {
  kind: 'populated';
  items: CollectionItemViewModel[];
};

export type CollectionViewModel = EmptyCollectionViewModel | PopulatedCollectionViewModel;

export type CollectionFilterChip = 'All' | 'Igneous' | 'Sedimentary' | 'Metamorphic' | 'Low confidence';

const savedDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

/**
 * Creates a render-ready view model for the Collection screen from saved finds.
 */
export function createCollectionViewModel(
  savedFinds: SavedFind[],
  input?: { query?: string; filter?: CollectionFilterChip }
): CollectionViewModel {
  const query = input?.query?.trim().toLowerCase() ?? '';
  const filter = input?.filter ?? 'All';

  if (savedFinds.length === 0) {
    return {
      kind: 'empty',
      title: 'No saved rocks yet',
      message: 'Save an identification result to build your field collection.',
      action: { kind: 'identify', label: 'Identify a rock' },
      items: [],
    };
  }

  const filtered = applyFilters(savedFinds, { query, filter });
  if (filtered.length === 0) {
    return {
      kind: 'empty',
      title: 'No results found',
      message: 'Try a different search or filter.',
      action: { kind: 'reset', label: 'Reset filters' },
      items: [],
    };
  }

  return {
    kind: 'populated',
    items: [...filtered].sort(compareSavedAtDescending).map(toCollectionItem),
  };
}

/**
 * Sorts saved finds so newest appears first.
 */
function compareSavedAtDescending(first: SavedFind, second: SavedFind): number {
  return second.savedAt - first.savedAt;
}

/**
 * Maps a saved-find record into the fields needed by the Collection list UI.
 */
function toCollectionItem(savedFind: SavedFind): CollectionItemViewModel {
  return {
    id: savedFind.id,
    title: savedFind.title,
    categoryLabel: savedFind.topMatch.category,
    confidenceLabel: `${savedFind.confidence} confidence`,
    savedAtLabel: `Saved ${savedDateFormatter.format(new Date(savedFind.savedAt))}`,
    imageUri: savedFind.imageUri,
    hasImage: typeof savedFind.imageUri === 'string' && savedFind.imageUri.length > 0,
  };
}

/**
 * Applies query + chip filters for the Collection screen.
 */
function applyFilters(savedFinds: SavedFind[], input: { query: string; filter: CollectionFilterChip }): SavedFind[] {
  return savedFinds.filter((find) => {
    if (input.filter === 'Low confidence' && find.confidence !== 'Low') return false;
    if (input.filter !== 'All' && input.filter !== 'Low confidence') {
      const group = getCategoryGroup(find.topMatch.category);
      if (group !== input.filter) return false;
    }

    if (!input.query) return true;
    const haystack = `${find.title} ${find.topMatch.name} ${find.topMatch.category}`.toLowerCase();
    return haystack.includes(input.query);
  });
}

/**
 * Groups a category string into one of the filter chips used on Collection.
 */
function getCategoryGroup(category: string): Exclude<CollectionFilterChip, 'All' | 'Low confidence'> | 'Other' {
  const normalized = category.toLowerCase();
  if (normalized.includes('igneous')) return 'Igneous';
  if (normalized.includes('sedimentary')) return 'Sedimentary';
  if (normalized.includes('metamorphic')) return 'Metamorphic';
  return 'Other';
}

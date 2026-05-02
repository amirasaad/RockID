import type { SavedFind } from './saved-finds';

export type CollectionItemViewModel = {
  id: string;
  title: string;
  confidenceLabel: string;
  savedAtLabel: string;
  imageUri?: string;
  hasImage: boolean;
};

export type EmptyCollectionViewModel = {
  kind: 'empty';
  title: string;
  message: string;
  items: CollectionItemViewModel[];
};

export type PopulatedCollectionViewModel = {
  kind: 'populated';
  items: CollectionItemViewModel[];
};

export type CollectionViewModel = EmptyCollectionViewModel | PopulatedCollectionViewModel;

const savedDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

export function createCollectionViewModel(savedFinds: SavedFind[]): CollectionViewModel {
  if (savedFinds.length === 0) {
    return {
      kind: 'empty',
      title: 'No saved rocks yet',
      message: 'Save an identification result to build your field collection.',
      items: [],
    };
  }

  return {
    kind: 'populated',
    items: [...savedFinds].sort(compareSavedAtDescending).map(toCollectionItem),
  };
}

function compareSavedAtDescending(first: SavedFind, second: SavedFind): number {
  return second.savedAt - first.savedAt;
}

function toCollectionItem(savedFind: SavedFind): CollectionItemViewModel {
  return {
    id: savedFind.id,
    title: savedFind.title,
    confidenceLabel: `${savedFind.confidence} confidence`,
    savedAtLabel: `Saved ${savedDateFormatter.format(new Date(savedFind.savedAt))}`,
    imageUri: savedFind.imageUri,
    hasImage: typeof savedFind.imageUri === 'string' && savedFind.imageUri.length > 0,
  };
}

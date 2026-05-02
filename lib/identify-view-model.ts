import type { SavedFind } from './saved-finds';

export type IdentifyRecentFindItemViewModel = {
  id: string;
  title: string;
  confidenceLabel: string;
  savedAtLabel: string;
  href: {
    pathname: '/saved/[id]';
    params: { id: string };
  };
};

export type IdentifyRecentFindsEmptyViewModel = {
  kind: 'empty';
  title: string;
  message: string;
  items: IdentifyRecentFindItemViewModel[];
};

export type IdentifyRecentFindsPopulatedViewModel = {
  kind: 'populated';
  items: IdentifyRecentFindItemViewModel[];
};

export type IdentifyRecentFindsViewModel = IdentifyRecentFindsEmptyViewModel | IdentifyRecentFindsPopulatedViewModel;

const savedDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

export function createIdentifyRecentFindsViewModel(savedFinds: SavedFind[]): IdentifyRecentFindsViewModel {
  if (savedFinds.length === 0) {
    return {
      kind: 'empty',
      title: 'No recent finds yet',
      message: 'Save an identification result to see it here.',
      items: [],
    };
  }

  return {
    kind: 'populated',
    items: [...savedFinds].sort(compareSavedAtDescending).slice(0, 3).map(toRecentFindItem),
  };
}

function compareSavedAtDescending(first: SavedFind, second: SavedFind): number {
  return second.savedAt - first.savedAt;
}

function toRecentFindItem(savedFind: SavedFind): IdentifyRecentFindItemViewModel {
  return {
    id: savedFind.id,
    title: savedFind.title,
    confidenceLabel: `${savedFind.confidence} confidence`,
    savedAtLabel: `Saved ${savedDateFormatter.format(new Date(savedFind.savedAt))}`,
    href: {
      pathname: '/saved/[id]',
      params: { id: savedFind.id },
    },
  };
}

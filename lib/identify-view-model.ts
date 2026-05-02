import type { SavedFind } from './saved-finds';

export type IdentifyRecentFindItemViewModel = {
  id: string;
  title: string;
  confidenceLabel: string;
  savedAtLabel: string;
  href: string;
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
    items: [],
  };
}

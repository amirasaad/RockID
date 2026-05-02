import type { SavedFind } from './saved-finds';

export type SavedFindPreviewViewModel =
  | {
      kind: 'image';
      imageUri: string;
    }
  | {
      kind: 'missing-image';
      fallbackText: string;
    };

export type SavedFindDetailViewModel = {
  title: string;
  category: string;
  confidenceLabel: string;
  notes: string;
  savedAtLabel: string;
  preview: SavedFindPreviewViewModel;
};

const savedDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

/**
 * Creates a UI-ready view model for the saved-find detail screen.
 * @param savedFind - The saved find record from the store.
 * @returns A stable, presentation-focused view model.
 */
export function createSavedFindDetailViewModel(savedFind: SavedFind): SavedFindDetailViewModel {
  return {
    title: savedFind.title,
    category: savedFind.topMatch.category,
    confidenceLabel: `Confidence: ${savedFind.confidence}`,
    notes: savedFind.notes,
    savedAtLabel: savedDateFormatter.format(new Date(savedFind.savedAt)),
    preview: createPreview(savedFind.imageUri),
  };
}

/**
 * Creates the preview view model, including a missing-image fallback.
 * @param imageUri - Optional image URI stored on the saved find.
 * @returns Preview view model.
 */
function createPreview(imageUri: SavedFind['imageUri']): SavedFindPreviewViewModel {
  if (typeof imageUri === 'string' && imageUri.length > 0) {
    return { kind: 'image', imageUri };
  }
  return { kind: 'missing-image', fallbackText: 'Photo missing' };
}


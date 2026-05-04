import type { IdentificationSession } from './identification-session';
import type { MockAnalysisResult } from './mock-analysis';
import type { SavedFind } from './saved-finds';
import { createSavedFind } from './saved-finds';

export type SaveFindFn = (savedFind: SavedFind) => SavedFind;
export type PersistPhotoUriFn = (input: { photoUri: string; savedFindId: string }) => Promise<string>;

/**
 * Saves the current analysis result as a saved find and returns the saved record.
 * @param input - Session and analysis inputs plus the store write function.
 * @returns The saved find record written to the store.
 */
export function saveIdentificationResult(input: {
  session: IdentificationSession;
  analysis: MockAnalysisResult;
  saveFind: SaveFindFn;
}): SavedFind {
  const savedFind = createSavedFind({ session: input.session, analysis: input.analysis });
  return input.saveFind(savedFind);
}

export async function saveIdentificationResultAsync(input: {
  session: IdentificationSession;
  analysis: MockAnalysisResult;
  saveFind: SaveFindFn;
  savePhotosLocally: boolean;
  persistPhotoUri?: PersistPhotoUriFn;
}): Promise<SavedFind> {
  const base = createSavedFind({ session: input.session, analysis: input.analysis });
  const photoUri = base.imageUri;

  if (!input.savePhotosLocally || !input.persistPhotoUri || typeof photoUri !== 'string' || photoUri.length === 0) {
    return input.saveFind(base);
  }

  try {
    const persistedUri = await input.persistPhotoUri({ photoUri, savedFindId: base.id });
    return input.saveFind({ ...base, imageUri: persistedUri });
  } catch {
    return input.saveFind(base);
  }
}

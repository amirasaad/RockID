import type { IdentificationSession } from './identification-session';
import type { MockAnalysisResult } from './mock-analysis';
import type { SavedFind } from './saved-finds';
import { createSavedFind } from './saved-finds';

export type SaveFindFn = (savedFind: SavedFind) => SavedFind;

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


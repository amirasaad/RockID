import type { IdentificationSession } from './identification-session';
import type { MockAnalysisResult } from './mock-analysis';
import type { RockMatch } from './mock-data';

export type SavedFind = {
  id: string;
  sessionId: string;
  imageUri?: string;
  title: string;
  confidence: RockMatch['confidence'];
  notes: string;
  savedAt: number;
  topMatch: RockMatch;
  matches: RockMatch[];
};

export type CreateSavedFindInput = {
  session: IdentificationSession;
  analysis: MockAnalysisResult;
  savedAt?: number;
};

export function createSavedFind({ session, analysis, savedAt = Date.now() }: CreateSavedFindInput): SavedFind {
  return {
    id: createSavedFindId(session.id),
    sessionId: session.id,
    imageUri: analysis.imageUri ?? session.selectedPhoto?.uri,
    title: analysis.topMatch.name,
    confidence: analysis.topMatch.confidence,
    notes: session.observations?.notes ?? '',
    savedAt,
    topMatch: analysis.topMatch,
    matches: [...analysis.matches],
  };
}

function createSavedFindId(sessionId: string): string {
  return `find-${sessionId}`;
}

export type SavedFindSnapshot = {
  savedFinds: SavedFind[];
};

export type SavedFindStore = {
  save: (savedFind: SavedFind) => SavedFind;
  getSnapshot: () => SavedFindSnapshot;
};

function compareSavedAtDescending(first: SavedFind, second: SavedFind): number {
  return second.savedAt - first.savedAt;
}

export function createSavedFindStore(): SavedFindStore {
  let savedFinds: SavedFind[] = [];

  return {
    save(savedFind) {
      savedFinds = [savedFind, ...savedFinds].sort(compareSavedAtDescending);
      return savedFind;
    },
    getSnapshot() {
      return { savedFinds: [...savedFinds] };
    },
  };
}

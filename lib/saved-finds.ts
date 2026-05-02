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

type CreateSavedFindInput = {
  session: IdentificationSession;
  analysis: MockAnalysisResult;
  savedAt?: number;
};

export function createSavedFind({ session, analysis, savedAt = Date.now() }: CreateSavedFindInput): SavedFind {
  return {
    id: `find-${session.id}`,
    sessionId: session.id,
    imageUri: analysis.imageUri ?? session.selectedPhoto?.uri,
    title: analysis.topMatch.name,
    confidence: analysis.topMatch.confidence,
    notes: session.observations?.notes ?? '',
    savedAt,
    topMatch: analysis.topMatch,
    matches: analysis.matches,
  };
}

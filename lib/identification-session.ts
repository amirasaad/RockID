import type { RockMatch } from './mock-data';

export type PhotoSource = 'upload' | 'camera';

export type SelectedRockPhoto = {
  source: PhotoSource;
  uri: string;
  width?: number;
  height?: number;
};

export type RockObservations = {
  color: string;
  grainSize: string;
  features: string[];
  notes: string;
};

export type IdentificationAnalysisMode = 'details' | 'photo';

export type IdentificationSession = {
  id: string;
  selectedPhoto?: SelectedRockPhoto;
  observations?: RockObservations;
  analysisMode?: IdentificationAnalysisMode;
  createdAt: number;
  updatedAt: number;
};

export type IdentificationAnalysis = {
  sessionId: string;
  imageUri?: string;
  matches: RockMatch[];
  topMatch: RockMatch;
  reasoning: string;
  nextCheck: string;
};

export type IdentificationSessionSnapshot = {
  session: IdentificationSession | null;
  analysis: IdentificationAnalysis | null;
};

export type IdentificationSessionStore = {
  startSession: (selectedPhoto?: SelectedRockPhoto) => IdentificationSession;
  setSelectedPhoto: (selectedPhoto: SelectedRockPhoto) => IdentificationSession;
  setObservations: (observations: RockObservations) => IdentificationSession;
  setAnalysisMode: (mode: IdentificationAnalysisMode) => IdentificationSession;
  setAnalysis: (analysis: IdentificationAnalysis) => IdentificationAnalysis;
  getSnapshot: () => IdentificationSessionSnapshot;
  reset: () => void;
};

/**
 * Creates an in-memory identification session store.
 * @returns A store that can start/reset a session and update selected photo + observations.
 */
export function createIdentificationSessionStore(): IdentificationSessionStore {
  let session: IdentificationSession | null = null;
  let analysis: IdentificationAnalysis | null = null;

  function touch(next: IdentificationSession): IdentificationSession {
    session = {
      ...next,
      updatedAt: Date.now(),
    };
    analysis = null;
    return session;
  }

  return {
    startSession(selectedPhoto) {
      const now = Date.now();
      session = {
        id: createSessionId(),
        selectedPhoto,
        analysisMode: 'details',
        createdAt: now,
        updatedAt: now,
      };
      analysis = null;
      return session;
    },
    setSelectedPhoto(selectedPhoto) {
      const next = session ?? {
        id: createSessionId(),
        analysisMode: 'details',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      return touch({ ...next, selectedPhoto });
    },
    setObservations(observations) {
      const next = session ?? {
        id: createSessionId(),
        analysisMode: 'details',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      return touch({ ...next, observations });
    },
    setAnalysisMode(mode) {
      const next = session ?? {
        id: createSessionId(),
        analysisMode: 'details',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      return touch({ ...next, analysisMode: mode });
    },
    setAnalysis(nextAnalysis) {
      analysis = nextAnalysis;
      return nextAnalysis;
    },
    getSnapshot() {
      return { session, analysis };
    },
    reset() {
      session = null;
      analysis = null;
    },
  };
}

/**
 * Creates a session id suitable for in-memory session tracking.
 * @returns A reasonably unique string identifier.
 */
export function createSessionId(): string {
  const cryptoUuid = globalThis.crypto?.randomUUID?.();
  if (cryptoUuid) return cryptoUuid;
  return `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

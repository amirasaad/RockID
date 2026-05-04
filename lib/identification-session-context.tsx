import React, { createContext, useContext, useMemo, useState } from 'react';

import type {
  IdentificationAnalysis,
  IdentificationAnalysisMode,
  IdentificationSession,
  RockObservations,
  SelectedRockPhoto,
} from './identification-session';
import { createIdentificationSessionStore } from './identification-session';

type IdentificationSessionContextValue = {
  session: IdentificationSession | null;
  analysis: IdentificationAnalysis | null;
  startSession: (selectedPhoto: SelectedRockPhoto) => IdentificationSession;
  setSelectedPhoto: (selectedPhoto: SelectedRockPhoto) => IdentificationSession;
  setObservations: (observations: RockObservations) => IdentificationSession;
  setAnalysisMode: (mode: IdentificationAnalysisMode) => IdentificationSession;
  setAnalysis: (analysis: IdentificationAnalysis) => IdentificationAnalysis;
  resetSession: () => void;
};

const IdentificationSessionContext = createContext<IdentificationSessionContextValue | null>(null);

/**
 * Provides a single in-memory identification session for the app runtime.
 * @param props - Standard React provider props.
 * @returns Provider component.
 */
export function IdentificationSessionProvider(props: { children: React.ReactNode }) {
  const store = useMemo(() => createIdentificationSessionStore(), []);
  const [session, setSession] = useState<IdentificationSession | null>(store.getSnapshot().session);
  const [analysis, setAnalysis] = useState<IdentificationAnalysis | null>(store.getSnapshot().analysis);

  const value: IdentificationSessionContextValue = {
    session,
    analysis,
    startSession(selectedPhoto) {
      const next = store.startSession(selectedPhoto);
      setSession(next);
      setAnalysis(store.getSnapshot().analysis);
      return next;
    },
    setSelectedPhoto(selectedPhoto) {
      const next = store.setSelectedPhoto(selectedPhoto);
      setSession(next);
      setAnalysis(store.getSnapshot().analysis);
      return next;
    },
    setObservations(observations) {
      const next = store.setObservations(observations);
      setSession(next);
      setAnalysis(store.getSnapshot().analysis);
      return next;
    },
    setAnalysisMode(mode) {
      const next = store.setAnalysisMode(mode);
      setSession(next);
      setAnalysis(store.getSnapshot().analysis);
      return next;
    },
    setAnalysis(nextAnalysis) {
      const next = store.setAnalysis(nextAnalysis);
      setAnalysis(next);
      return next;
    },
    resetSession() {
      store.reset();
      setSession(null);
      setAnalysis(null);
    },
  };

  return <IdentificationSessionContext.Provider value={value}>{props.children}</IdentificationSessionContext.Provider>;
}

/**
 * Reads and mutates the current identification session.
 * @returns Session state and actions.
 */
export function useIdentificationSession(): IdentificationSessionContextValue {
  const ctx = useContext(IdentificationSessionContext);
  if (!ctx) {
    throw new Error('useIdentificationSession must be used within IdentificationSessionProvider');
  }
  return ctx;
}

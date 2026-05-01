import React, { createContext, useContext, useMemo, useState } from 'react';

import type { IdentificationSession, RockObservations, SelectedRockPhoto } from './identification-session';
import { createIdentificationSessionStore } from './identification-session';

type IdentificationSessionContextValue = {
  session: IdentificationSession | null;
  startSession: (selectedPhoto: SelectedRockPhoto) => IdentificationSession;
  setSelectedPhoto: (selectedPhoto: SelectedRockPhoto) => IdentificationSession;
  setObservations: (observations: RockObservations) => IdentificationSession;
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

  const value: IdentificationSessionContextValue = {
    session,
    startSession(selectedPhoto) {
      const next = store.startSession(selectedPhoto);
      setSession(next);
      return next;
    },
    setSelectedPhoto(selectedPhoto) {
      const next = store.setSelectedPhoto(selectedPhoto);
      setSession(next);
      return next;
    },
    setObservations(observations) {
      const next = store.setObservations(observations);
      setSession(next);
      return next;
    },
    resetSession() {
      store.reset();
      setSession(null);
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


import React, { createContext, useContext, useMemo, useState } from 'react';

import type { SavedFind } from './saved-finds';
import { createSavedFindStore } from './saved-finds';

type SavedFindsContextValue = {
  savedFinds: SavedFind[];
  saveFind: (savedFind: SavedFind) => SavedFind;
};

const SavedFindsContext = createContext<SavedFindsContextValue | null>(null);

export function SavedFindsProvider(props: { children: React.ReactNode }) {
  const store = useMemo(() => createSavedFindStore(), []);
  const [savedFinds, setSavedFinds] = useState<SavedFind[]>(store.getSnapshot().savedFinds);

  const value: SavedFindsContextValue = {
    savedFinds,
    saveFind(savedFind) {
      const next = store.save(savedFind);
      setSavedFinds(store.getSnapshot().savedFinds);
      return next;
    },
  };

  return <SavedFindsContext.Provider value={value}>{props.children}</SavedFindsContext.Provider>;
}

export function useSavedFinds(): SavedFindsContextValue {
  const ctx = useContext(SavedFindsContext);
  if (!ctx) {
    throw new Error('useSavedFinds must be used within SavedFindsProvider');
  }
  return ctx;
}

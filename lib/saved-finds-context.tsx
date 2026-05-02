import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

import type { SavedFind } from './saved-finds';
import { createSavedFindStore } from './saved-finds';
import type { KeyValueStorage, PersistedStoreController } from './saved-finds-persistence';
import { createPersistedSavedFindStore } from './saved-finds-persistence';

type AsyncStorageLike = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
};

async function resolveKeyValueStorage(): Promise<KeyValueStorage> {
  const asyncStorage = await resolveAsyncStorage();
  if (!asyncStorage) return createNoopStorage();
  return {
    getItem: asyncStorage.getItem,
    setItem: asyncStorage.setItem,
  };
}

async function resolveAsyncStorage(): Promise<AsyncStorageLike | null> {
  try {
    const module = await import('@react-native-async-storage/async-storage');
    return module.default;
  } catch {
    return null;
  }
}

function createNoopStorage(): KeyValueStorage {
  return {
    async getItem() {
      return null;
    },
    async setItem() {
      return;
    },
  };
}

type SavedFindsContextValue = {
  savedFinds: SavedFind[];
  saveFind: (savedFind: SavedFind) => SavedFind;
  deleteFind: (id: string) => boolean;
};

const SavedFindsContext = createContext<SavedFindsContextValue | null>(null);

export type SavedFindsRepository = {
  hydrate: () => Promise<void>;
  flush: () => Promise<void>;
  saveFind: (savedFind: SavedFind) => SavedFind;
  deleteFind: (id: string) => boolean;
  getSnapshot: () => { savedFinds: SavedFind[] };
};

export function createSavedFindsRepository(input: { storage: KeyValueStorage }): SavedFindsRepository {
  const store = createSavedFindStore();
  const controller = createPersistedSavedFindStore({ store, storage: input.storage });

  return {
    hydrate: controller.hydrate,
    flush: controller.flush,
    saveFind(savedFind) {
      return store.save(savedFind);
    },
    deleteFind(id) {
      return store.delete(id);
    },
    getSnapshot: store.getSnapshot,
  };
}

export function SavedFindsProvider(props: { children: React.ReactNode }) {
  const store = useMemo(() => createSavedFindStore(), []);
  const controller = useRef<PersistedStoreController | null>(null);
  const [savedFinds, setSavedFinds] = useState<SavedFind[]>(store.getSnapshot().savedFinds);

  useEffect(() => {
    void (async () => {
      const storage = await resolveKeyValueStorage();
      const persisted = createPersistedSavedFindStore({ store, storage });
      controller.current = persisted;
      await persisted.hydrate();
      setSavedFinds(store.getSnapshot().savedFinds);
    })();
  }, [store]);

  const value: SavedFindsContextValue = {
    savedFinds,
    saveFind(savedFind) {
      const next = store.save(savedFind);
      setSavedFinds(store.getSnapshot().savedFinds);
      if (controller.current) void controller.current.flush();
      return next;
    },
    deleteFind(id) {
      const deleted = store.delete(id);
      setSavedFinds(store.getSnapshot().savedFinds);
      if (controller.current) void controller.current.flush();
      return deleted;
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

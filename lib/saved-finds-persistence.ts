import type { SavedFind, SavedFindStore } from './saved-finds';
import { createSavedFindStore } from './saved-finds';

export type KeyValueStorage = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
};

const STORAGE_KEY = 'rockid.savedFinds.v1';

/**
 * Creates a saved-find store that hydrates from, and persists to, the provided storage.
 * @param input - Storage dependency used for load/save.
 * @returns A saved-find store whose save() writes through to storage.
 */
export async function createSavedFindStoreWithPersistence(input: { storage: KeyValueStorage }): Promise<SavedFindStore> {
  const persisted = await loadSavedFinds(input.storage);
  const base = createSavedFindStoreWithInitialState(persisted);

  return {
    save(savedFind) {
      const next = base.save(savedFind);
      void persistSavedFinds(input.storage, base.getSnapshot().savedFinds);
      return next;
    },
    getSnapshot: base.getSnapshot,
  };
}

/**
 * Creates an in-memory KeyValueStorage for tests.
 * @returns A simple in-memory storage implementation.
 */
export function createTestKeyValueStorage(): KeyValueStorage {
  const map = new Map<string, string>();
  return {
    async getItem(key) {
      return map.has(key) ? map.get(key)! : null;
    },
    async setItem(key, value) {
      map.set(key, value);
    },
  };
}

/**
 * Loads saved finds from storage, returning an empty list on missing/corrupt data.
 * @param storage - The KeyValueStorage implementation.
 * @returns A list of saved finds.
 */
export async function loadSavedFinds(storage: KeyValueStorage): Promise<SavedFind[]> {
  const raw = await storage.getItem(STORAGE_KEY);
  if (typeof raw !== 'string' || raw.length === 0) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isSavedFind);
  } catch {
    return [];
  }
}

/**
 * Persists a list of saved finds to storage.
 * @param storage - The KeyValueStorage implementation.
 * @param savedFinds - Saved finds to persist.
 */
export async function persistSavedFinds(storage: KeyValueStorage, savedFinds: SavedFind[]): Promise<void> {
  await storage.setItem(STORAGE_KEY, JSON.stringify(savedFinds));
}

function createSavedFindStoreWithInitialState(initial: SavedFind[]): SavedFindStore {
  const base = createSavedFindStore();
  initial.forEach((find) => base.save(find));
  return base;
}

function isSavedFind(value: unknown): value is SavedFind {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === 'string' &&
    typeof record.sessionId === 'string' &&
    typeof record.title === 'string' &&
    typeof record.notes === 'string' &&
    typeof record.savedAt === 'number' &&
    typeof record.confidence === 'string' &&
    record.topMatch !== null &&
    typeof record.topMatch === 'object' &&
    Array.isArray(record.matches)
  );
}

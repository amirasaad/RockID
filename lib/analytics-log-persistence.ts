import type { AnalyticsLogEntry, AnalyticsLogStore } from './analytics-log';
import { createAnalyticsLogStore } from './analytics-log';

export type KeyValueStorage = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
};

const STORAGE_KEY = 'rockid.analyticsLog.v1';

export async function createAnalyticsLogStoreWithPersistence(input: {
  storage: KeyValueStorage;
  maxEntries?: number;
}): Promise<AnalyticsLogStore> {
  const persisted = await loadAnalyticsLogEntries(input.storage);
  const base = createAnalyticsLogStore({ maxEntries: input.maxEntries });
  persisted.forEach((entry) => base.add(entry));

  return {
    add(entry) {
      base.add(entry);
      void persistAnalyticsLogEntries(input.storage, base.getSnapshot().entries);
    },
    clear() {
      base.clear();
      void persistAnalyticsLogEntries(input.storage, base.getSnapshot().entries);
    },
    getSnapshot: base.getSnapshot,
  };
}

export async function loadAnalyticsLogEntries(storage: KeyValueStorage): Promise<AnalyticsLogEntry[]> {
  const raw = await storage.getItem(STORAGE_KEY);
  if (typeof raw !== 'string' || raw.length === 0) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isAnalyticsLogEntry);
  } catch {
    return [];
  }
}

export async function persistAnalyticsLogEntries(storage: KeyValueStorage, entries: AnalyticsLogEntry[]): Promise<void> {
  await storage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function isAnalyticsLogEntry(value: unknown): value is AnalyticsLogEntry {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return typeof record.ts === 'number' && typeof record.event === 'string';
}


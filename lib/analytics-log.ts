import type { AnalyticsEvent, AnalyticsProperties } from './analytics';

export type AnalyticsLogEntry = {
  ts: number;
  event: AnalyticsEvent;
  properties?: AnalyticsProperties;
};

export type AnalyticsLogSnapshot = {
  entries: AnalyticsLogEntry[];
};

export type AnalyticsLogStore = {
  add: (entry: AnalyticsLogEntry) => void;
  clear: () => void;
  getSnapshot: () => AnalyticsLogSnapshot;
};

export function createAnalyticsLogStore(input?: { maxEntries?: number }): AnalyticsLogStore {
  const maxEntries = input?.maxEntries ?? 200;
  let entries: AnalyticsLogEntry[] = [];

  return {
    add(entry) {
      entries = [...entries, entry].slice(-maxEntries);
    },
    clear() {
      entries = [];
    },
    getSnapshot() {
      return { entries: [...entries] };
    },
  };
}


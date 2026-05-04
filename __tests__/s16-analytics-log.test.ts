import { describe, expect, it } from 'vitest';

import { createAnalyticsLogStore } from '@/lib/analytics-log';
import { createAnalyticsLogStoreWithPersistence } from '@/lib/analytics-log-persistence';

describe('S16 analytics log', () => {
  it('keeps only the newest entries', () => {
    const store = createAnalyticsLogStore({ maxEntries: 2 });

    store.add({ ts: 1, event: 'home_viewed' });
    store.add({ ts: 2, event: 'learn_tab_viewed' });
    store.add({ ts: 3, event: 'analysis_started' });

    expect(store.getSnapshot().entries.map((e) => e.ts)).toEqual([2, 3]);
  });

  it('persists entries to storage on add()', async () => {
    const storage = createTestStorage();
    const store = await createAnalyticsLogStoreWithPersistence({ storage, maxEntries: 10 });

    store.add({ ts: 1, event: 'home_viewed', properties: { source: 'test' } });
    store.add({ ts: 2, event: 'analysis_started' });

    const raw = await storage.getItem('rockid.analyticsLog.v1');
    expect(raw).toContain('home_viewed');
    expect(raw).toContain('analysis_started');
  });
});

function createTestStorage(): { getItem: (key: string) => Promise<string | null>; setItem: (key: string, value: string) => Promise<void> } {
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


import { configureAnalyticsLogSink, type AnalyticsSink } from './analytics';
import { createAnalyticsLogStoreWithPersistence, type KeyValueStorage } from './analytics-log-persistence';

type AsyncStorageLike = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
};

async function resolveAsyncStorage(): Promise<AsyncStorageLike | null> {
  try {
    const module = await import('@react-native-async-storage/async-storage');
    return module.default;
  } catch {
    return null;
  }
}

function shouldEnableAnalyticsLog(): boolean {
  const raw =
    typeof process !== 'undefined' && process.env
      ? process.env.EXPO_PUBLIC_ROCKID_ENABLE_ANALYTICS_LOG
      : undefined;
  return raw === '1' || raw === 'true';
}

export async function bootstrapAnalyticsLogFromEnv(): Promise<void> {
  if (!shouldEnableAnalyticsLog()) return;

  const asyncStorage = await resolveAsyncStorage();
  if (!asyncStorage) return;

  const storage: KeyValueStorage = {
    getItem: asyncStorage.getItem,
    setItem: asyncStorage.setItem,
  };

  const store = await createAnalyticsLogStoreWithPersistence({ storage, maxEntries: 200 });
  const sink: AnalyticsSink = (event, properties) => {
    store.add({ ts: Date.now(), event, properties });
  };

  configureAnalyticsLogSink(sink);
}

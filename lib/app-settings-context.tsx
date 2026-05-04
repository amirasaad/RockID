import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import type { AppSettings } from './app-settings';
import { DEFAULT_APP_SETTINGS } from './app-settings';

type AsyncStorageLike = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
};

const STORAGE_KEY = 'rockid.appSettings.v1';

async function resolveAsyncStorage(): Promise<AsyncStorageLike | null> {
  try {
    const module = await import('@react-native-async-storage/async-storage');
    return module.default;
  } catch {
    return null;
  }
}

async function loadSettings(): Promise<AppSettings> {
  const storage = await resolveAsyncStorage();
  if (!storage) return DEFAULT_APP_SETTINGS;

  const raw = await storage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_APP_SETTINGS;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return DEFAULT_APP_SETTINGS;
    const record = parsed as Partial<Record<keyof AppSettings, unknown>>;
    return {
      savePhotosLocally: typeof record.savePhotosLocally === 'boolean' ? record.savePhotosLocally : DEFAULT_APP_SETTINGS.savePhotosLocally,
    };
  } catch {
    return DEFAULT_APP_SETTINGS;
  }
}

async function persistSettings(settings: AppSettings): Promise<void> {
  const storage = await resolveAsyncStorage();
  if (!storage) return;
  await storage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

type AppSettingsContextValue = {
  settings: AppSettings;
  setSavePhotosLocally: (enabled: boolean) => void;
};

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null);

export function AppSettingsProvider(props: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    void (async () => {
      const loaded = await loadSettings();
      setSettings(loaded);
      setHydrated(true);
    })();
  }, []);

  const value: AppSettingsContextValue = useMemo(
    () => ({
      settings,
      setSavePhotosLocally(enabled) {
        const next = { ...settings, savePhotosLocally: enabled };
        setSettings(next);
        if (hydrated) void persistSettings(next);
      },
    }),
    [hydrated, settings]
  );

  return <AppSettingsContext.Provider value={value}>{props.children}</AppSettingsContext.Provider>;
}

export function useAppSettings(): AppSettingsContextValue {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) {
    throw new Error('useAppSettings must be used within AppSettingsProvider');
  }
  return ctx;
}


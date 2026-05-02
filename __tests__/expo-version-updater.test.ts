import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

type VersionUpdater = {
  readVersion(contents: string): string;
  writeVersion(contents: string, version: string): string;
};

const require = createRequire(import.meta.url);
const updater = require('../scripts/expo-version-updater.cjs') as VersionUpdater;

describe('expo-version-updater', () => {
  it('reads the Expo app version from app.json', () => {
    const contents = JSON.stringify({ expo: { version: '0.2.0' } });

    expect(updater.readVersion(contents)).toBe('0.2.0');
  });

  it('updates only expo.version and preserves other Expo config', () => {
    const contents = JSON.stringify({
      expo: {
        name: 'Rock ID',
        slug: 'rock-id',
        version: '0.2.0',
      },
    });

    const result = JSON.parse(updater.writeVersion(contents, '0.3.0'));

    expect(result).toEqual({
      expo: {
        name: 'Rock ID',
        slug: 'rock-id',
        version: '0.3.0',
      },
    });
  });
});

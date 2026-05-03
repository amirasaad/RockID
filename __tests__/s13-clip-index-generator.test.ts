import { describe, expect, it } from 'vitest';

import { readFile } from 'node:fs/promises';

import { generateClipIndexFromManifest, type ClipIndexManifest } from '@/lib/clip-index-generator';
import { parseClipIndex } from '@/lib/clip-index';
import { loadClipIndexFromFile } from '@/lib/clip-index-node';

describe('S13 clip index generator', () => {
  it('generates the demo index from the demo manifest', async () => {
    const manifestRaw = await readFile('data/clip/demo-manifest.json', 'utf8');
    const manifest = JSON.parse(manifestRaw) as ClipIndexManifest;

    const generated = generateClipIndexFromManifest(manifest);
    const validated = parseClipIndex(generated);
    const onDisk = await loadClipIndexFromFile('data/clip/demo-index.json');

    expect(validated).toEqual(onDisk);
  });
});


import { describe, expect, it } from 'vitest';

import { readFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

import { loadClipIndexFromFile } from '@/lib/clip-index-node';

const execFileAsync = promisify(execFile);

describe('S13 bytes index CLI acceptance', () => {
  it('generates a valid bytes-demo index that matches the checked-in artifact', async () => {
    const outDir = await mkdtemp(path.join(tmpdir(), 'rockid-bytes-index-'));
    const outPath = path.join(outDir, 'bytes-demo-index.json');

    await execFileAsync('node', [
      'scripts/generate-clip-index.mjs',
      '--manifest',
      'data/clip/bytes-demo-manifest.json',
      '--out',
      outPath,
      '--embedder',
      'bytes',
    ]);

    const generated = await loadClipIndexFromFile(outPath);
    const artifactRaw = await readFile('data/clip/bytes-demo-index.json', 'utf8');
    const artifact = JSON.parse(artifactRaw) as unknown;
    const onDisk = await loadClipIndexFromFile('data/clip/bytes-demo-index.json');

    expect(generated.version).toBe(1);
    expect(generated.embeddingDimension).toBe(8);
    expect(generated.items).toHaveLength(1);
    expect(generated.items[0]?.embedding).toHaveLength(8);

    expect(onDisk.version).toBe(1);
    expect(onDisk.embeddingDimension).toBe(8);
    expect(artifact).toEqual(onDisk);

    expect(generated.items[0]?.id).toBe(onDisk.items[0]?.id);
    expect(generated.items[0]?.label).toBe(onDisk.items[0]?.label);
    expect(generated.items[0]?.kind).toBe(onDisk.items[0]?.kind);

    const generatedEmbedding = generated.items[0]?.embedding ?? [];
    const diskEmbedding = onDisk.items[0]?.embedding ?? [];
    expect(generatedEmbedding).toHaveLength(diskEmbedding.length);
    for (let i = 0; i < generatedEmbedding.length; i += 1) {
      expect(generatedEmbedding[i]).toBeCloseTo(diskEmbedding[i] ?? 0, 12);
    }
  });
});


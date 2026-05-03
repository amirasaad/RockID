import { describe, expect, it } from 'vitest';

import { readFile } from 'node:fs/promises';

import type { IdentificationSession } from '@/lib/identification-session';
import { createClipKnnAnalyzer } from '@/lib/clip-knn';
import { embedBytesToVector } from '@/lib/clip-bytes-embedder';
import { toVectorIndexItems } from '@/lib/clip-index';
import { loadClipIndexFromFile } from '@/lib/clip-index-node';

describe('S13 bytes index-backed retrieval acceptance', () => {
  it('retrieves the bytes-demo item when the query uses the same bytes embedder', async () => {
    const clipIndex = await loadClipIndexFromFile('data/clip/bytes-demo-index.json');
    const index = toVectorIndexItems(clipIndex);
    const bytes = await readFile('data/clip/bytes-demo.txt');

    const analyzer = createClipKnnAnalyzer({
      index,
      topK: 3,
      embed: () => embedBytesToVector(bytes, clipIndex.embeddingDimension),
    });

    const analysis = analyzer(session({ id: 'bytes-demo', uri: 'file:///field/bytes-demo.txt' }));

    expect(analysis.matches).toHaveLength(1);
    expect(analysis.topMatch.name).toBe('Bytes Demo');
    expect(analysis.topMatch.confidence).toBe('High');
  });
});

function session(input: { id: string; uri: string }): IdentificationSession {
  return {
    id: input.id,
    selectedPhoto: {
      source: 'upload',
      uri: input.uri,
      width: 100,
      height: 100,
    },
    observations: {
      color: 'Light',
      grainSize: 'Coarse',
      features: [],
      notes: '',
    },
    createdAt: 1,
    updatedAt: 1,
  };
}


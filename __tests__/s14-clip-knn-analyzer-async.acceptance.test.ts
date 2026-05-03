import { describe, expect, it } from 'vitest';

import type { IdentificationSession } from '@/lib/identification-session';
import { createClipKnnAnalyzer, createClipKnnAnalyzerAsync, normalizeVector, type VectorIndexItem } from '@/lib/clip-knn';

describe('S14 CLIP kNN async analyzer acceptance', () => {
  it('returns the same matches as the sync analyzer when embeddings are identical', async () => {
    const index: VectorIndexItem[] = [
      item('granite-1', 'Granite', 'rock', [1, 0, 0]),
      item('basalt-1', 'Basalt', 'rock', [0.2, 0.98, 0]),
      item('slag-1', 'Slag', 'non-rock', [0.6, 0.8, 0]),
    ];

    const sync = createClipKnnAnalyzer({
      embed: () => normalizeVector([1, 0, 0]),
      index,
      topK: 3,
    });

    const asyncAnalyzer = createClipKnnAnalyzerAsync({
      embed: async () => normalizeVector([1, 0, 0]),
      index,
      topK: 3,
    });

    const input = session({ id: 'sess-1', uri: 'file:///field/example.jpg' });
    expect(await asyncAnalyzer(input)).toEqual(sync(input));
  });
});

function session(input: { id: string; uri: string }): IdentificationSession {
  return {
    id: input.id,
    selectedPhoto: {
      source: 'upload',
      uri: input.uri,
      width: 1200,
      height: 900,
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

function item(id: string, label: string, kind: VectorIndexItem['kind'], embedding: number[]): VectorIndexItem {
  return {
    id,
    label,
    kind,
    embedding: normalizeVector(embedding),
  };
}


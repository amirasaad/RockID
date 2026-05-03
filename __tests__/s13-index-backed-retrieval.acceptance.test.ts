import { describe, expect, it } from 'vitest';

import type { IdentificationSession } from '@/lib/identification-session';
import { createClipKnnAnalyzer, normalizeVector } from '@/lib/clip-knn';
import { loadClipIndexFromFile, toVectorIndexItems } from '@/lib/clip-index';

describe('S13 index-backed retrieval acceptance', () => {
  it('retrieves top-3 matches from the demo index and sets confidence bands', async () => {
    const clipIndex = await loadClipIndexFromFile('data/clip/demo-index.json');
    const index = toVectorIndexItems(clipIndex);

    const analyzer = createClipKnnAnalyzer({
      index,
      topK: 3,
      embed: (session) => {
        if (session.id === 'granite') return normalizeVector(oneHot(clipIndex.embeddingDimension, 0));
        if (session.id === 'basalt') return normalizeVector(oneHot(clipIndex.embeddingDimension, 1));
        if (session.id === 'slag') return normalizeVector(oneHot(clipIndex.embeddingDimension, 2));
        return normalizeVector(oneHot(clipIndex.embeddingDimension, 3));
      },
    });

    const granite = analyzer(session('granite'));
    expect(granite.matches.map((match) => match.name)).toEqual(['Granite', 'Basalt', 'Obsidian']);
    expect(granite.topMatch.confidence).toBe('High');

    const slag = analyzer(session('slag'));
    expect(slag.topMatch.name).toBe('Slag');
    expect(slag.topMatch.confidence).not.toBe('High');
  });
});

function oneHot(dimension: number, index: number): number[] {
  return Array.from({ length: dimension }, (_, position) => (position === index ? 1 : 0));
}

function session(id: string): IdentificationSession {
  return {
    id,
    selectedPhoto: {
      source: 'upload',
      uri: `file:///eval/${id}.jpg`,
      width: 1200,
      height: 900,
    },
    observations: {
      color: '',
      grainSize: '',
      features: [],
      notes: '',
    },
    createdAt: 1,
    updatedAt: 1,
  };
}

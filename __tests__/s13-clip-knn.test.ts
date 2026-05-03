import { describe, expect, it } from 'vitest';

import { cosineSimilarity, normalizeVector, rankByCosine, type VectorIndexItem } from '@/lib/clip-knn';

describe('S13 CLIP kNN foundation', () => {
  it('normalizes vectors to unit length', () => {
    const normalized = normalizeVector([3, 4]);

    expect(normalized).toEqual([0.6, 0.8]);
  });

  it('computes cosine similarity for normalized vectors', () => {
    const similarity = cosineSimilarity([1, 0], [0.6, 0.8]);

    expect(similarity).toBeCloseTo(0.6, 8);
  });

  it('ranks candidates by cosine similarity (topK)', () => {
    const query = normalizeVector([1, 0]);
    const items: VectorIndexItem[] = [
      { id: 'b', label: 'Basalt', kind: 'rock', embedding: normalizeVector([0, 1]) },
      { id: 'g', label: 'Granite', kind: 'rock', embedding: normalizeVector([1, 0]) },
      { id: 's', label: 'Slag', kind: 'non-rock', embedding: normalizeVector([0.8, 0.2]) },
      { id: 'o', label: 'Obsidian', kind: 'rock', embedding: normalizeVector([-1, 0]) },
    ];

    const ranked = rankByCosine({ queryEmbedding: query, items, topK: 3 });

    expect(ranked.map((candidate) => candidate.item.id)).toEqual(['g', 's', 'b']);
    expect(ranked[0].score).toBeCloseTo(1, 8);
  });

  it('breaks ties deterministically by item id', () => {
    const query = normalizeVector([1, 0]);
    const items: VectorIndexItem[] = [
      { id: 'b', label: 'Basalt', kind: 'rock', embedding: normalizeVector([1, 0]) },
      { id: 'a', label: 'Andesite', kind: 'rock', embedding: normalizeVector([1, 0]) },
    ];

    const ranked = rankByCosine({ queryEmbedding: query, items, topK: 2 });

    expect(ranked.map((candidate) => candidate.item.id)).toEqual(['a', 'b']);
    expect(ranked[0].score).toBeCloseTo(1, 8);
  });

  it('throws when vectors have different dimensions', () => {
    expect(() => cosineSimilarity([1, 0], [1, 0, 0])).toThrow(/dimension/i);
  });
});


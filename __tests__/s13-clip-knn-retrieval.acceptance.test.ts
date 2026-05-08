import { describe, expect, it } from 'vitest';

import { normalizeVector, retrieveByCosine, type VectorIndexItem } from '@/lib/clip-knn';

describe('S13 CLIP kNN retrieval acceptance', () => {
  it('retrieves top 3 matches and reports High confidence when the margin is clear', () => {
    const queryEmbedding = normalizeVector([1, 0, 0]);
    const items: VectorIndexItem[] = [
      item('granite-1', 'Granite', 'rock', [1, 0, 0]),
      item('basalt-1', 'Basalt', 'rock', [0.2, 0.98, 0]),
      item('slag-1', 'Slag', 'non-rock', [0.6, 0.8, 0]),
      item('obsidian-1', 'Obsidian', 'rock', [-1, 0, 0]),
    ];

    const result = retrieveByCosine({ queryEmbedding, items, topK: 3 });

    expect(result.matches.map((match) => match.item.label)).toEqual(['Granite', 'Slag', 'Basalt']);
    expect(result.possibleNonRock).toBe(false);
    expect(result.confidence).toBe('High');
  });

  it('flags possible non-rock when non-rock candidates dominate the top results', () => {
    const queryEmbedding = normalizeVector([1, 0, 0]);
    const items: VectorIndexItem[] = [
      item('slag-1', 'Slag', 'non-rock', [1, 0, 0]),
      item('concrete-1', 'Concrete', 'non-rock', [0.9, 0.1, 0]),
      item('basalt-1', 'Basalt', 'rock', [0.8, 0.2, 0]),
      item('granite-1', 'Granite', 'rock', [0.2, 0.98, 0]),
    ];

    const result = retrieveByCosine({ queryEmbedding, items, topK: 3 });

    expect(result.matches[0].item.kind).toBe('non-rock');
    expect(result.possibleNonRock).toBe(true);
    expect(result.confidence).not.toBe('High');
  });
});


  it('flags near-tie non-rock candidates as possible non-rock', () => {
    const queryEmbedding = normalizeVector([1, 0, 0]);
    const items: VectorIndexItem[] = [
      item('granite-1', 'Granite', 'rock', [1, 0, 0]),
      item('glass-1', 'Glass', 'non-rock', [0.78, 0.625, 0]),
      item('basalt-1', 'Basalt', 'rock', [0.4, 0.9165, 0]),
    ];

    const result = retrieveByCosine({ queryEmbedding, items, topK: 3 });

    expect(result.matches[0].item.kind).toBe('rock');
    expect(result.possibleNonRock).toBe(true);
    expect(result.confidence).not.toBe('High');
  });

function item(id: string, label: string, kind: VectorIndexItem['kind'], embedding: number[]): VectorIndexItem {
  return {
    id,
    label,
    kind,
    embedding: normalizeVector(embedding),
  };
}


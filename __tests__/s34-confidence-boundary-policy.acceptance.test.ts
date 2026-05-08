import { describe, expect, it } from 'vitest';

import { normalizeVector, retrieveByCosine, type VectorIndexItem } from '@/lib/clip-knn';

describe('S34 confidence boundary policy acceptance', () => {
  it('downgrades confidence when a non-rock candidate is near the top rock match', () => {
    const queryEmbedding = normalizeVector([1, 0, 0]);
    const items: VectorIndexItem[] = [
      item('granite-1', 'Granite', 'rock', [1, 0, 0]),
      item('glass-1', 'Glass', 'non-rock', [0.78, 0.625, 0]),
      item('basalt-1', 'Basalt', 'rock', [0.4, 0.9165, 0]),
    ];

    const result = retrieveByCosine({ queryEmbedding, items, topK: 3 });

    expect(result.matches[0].item.kind).toBe('rock');
    expect(result.possibleNonRock).toBe(true);
    expect(result.confidence).toBe('Medium');
  });

  it('keeps low confidence when non-rock dominates close boundary candidates', () => {
    const queryEmbedding = normalizeVector([1, 0, 0]);
    const items: VectorIndexItem[] = [
      item('slag-1', 'Slag', 'non-rock', [1, 0, 0]),
      item('concrete-1', 'Concrete', 'non-rock', [0.95, 0.312, 0]),
      item('granite-1', 'Granite', 'rock', [0.91, 0.414, 0]),
    ];

    const result = retrieveByCosine({ queryEmbedding, items, topK: 3 });

    expect(result.possibleNonRock).toBe(true);
    expect(result.matches[0].item.kind).toBe('non-rock');
    expect(result.confidence).not.toBe('High');
  });
});

function item(id: string, label: string, kind: VectorIndexItem['kind'], embedding: number[]): VectorIndexItem {
  return {
    id,
    label,
    kind,
    embedding: normalizeVector(embedding),
  };
}

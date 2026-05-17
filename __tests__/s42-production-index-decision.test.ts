import { describe, expect, it } from 'vitest';

import { normalizeVector, retrieveByCosine, type VectorIndexItem } from '@/lib/clip-knn';

describe('S42 production index decision', () => {
  it('keeps the Basalt support candidate out of production after expanded-eval rollback signal', () => {
    const productionCandidateIndex = [
      item('photo-basalt-1', 'Basalt', 'rock', [0, 1, 0, 0, 0, 0, 0, 0]),
      item('photo-basalt-vesicular-shade-support-1', 'Basalt', 'rock', [0, 0.6, 0.05, 0, 0, 0, 0, 0]),
      item('photo-slag-1', 'Slag', 'non-rock', [0, 0, 1, 0, 0, 0, 0, 0]),
      item('photo-asphalt-1', 'Asphalt', 'non-rock', [0, 0, 0, 0, 0, 1, 0, 0]),
      item('photo-coal-1', 'Coal', 'non-rock', [0, 0, 0, 0, 0, 0, 1, 0]),
    ];

    const clearBasalt = retrieveByCosine({
      queryEmbedding: normalizeVector([0, 1, 0, 0, 0, 0, 0, 0]),
      items: productionCandidateIndex,
      topK: 3,
    });

    expect(clearBasalt.matches[0].item.id).toBe('photo-basalt-1');
    expect(clearBasalt.matches[1].item.id).toBe('photo-basalt-vesicular-shade-support-1');
    expect(clearBasalt.confidence).toBe('Low');
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

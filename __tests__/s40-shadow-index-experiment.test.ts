import { describe, expect, it } from 'vitest';

import { normalizeVector, retrieveByCosine, type VectorIndexItem } from '@/lib/clip-knn';

describe('S40 shadow index-data experiment', () => {
  it('classifies the first dark-confuser neighbor candidate as unsafe to promote', () => {
    const queryEmbedding = normalizeVector([0, 0.75, 0.73, 0, 0, 0, 0, 0]);
    const candidateIndex = [
      item('photo-basalt-1', 'Basalt', 'rock', [0, 1, 0, 0, 0, 0, 0, 0]),
      item('photo-slag-1', 'Slag', 'non-rock', [0, 0, 1, 0, 0, 0, 0, 0]),
      item('photo-slag-vesicular-basalt-boundary-shadow', 'Slag', 'non-rock', [0, 0.72, 0.7, 0, 0, 0, 0, 0]),
      item('photo-asphalt-1', 'Asphalt', 'non-rock', [0, 0, 0, 0, 0, 1, 0, 0]),
      item('photo-coal-1', 'Coal', 'non-rock', [0, 0, 0, 0, 0, 0, 1, 0]),
    ];

    const result = retrieveByCosine({ queryEmbedding, items: candidateIndex, topK: 3 });

    expect(result.matches[0].item.id).toBe('photo-slag-vesicular-basalt-boundary-shadow');
    expect(result.matches[0].item.kind).toBe('non-rock');
    expect(result.matches.some((match) => match.item.label === 'Basalt')).toBe(true);
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

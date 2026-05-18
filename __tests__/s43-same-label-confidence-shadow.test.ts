import { describe, expect, it } from 'vitest';

import { normalizeVector, retrieveByCosine, type VectorIndexItem } from '@/lib/clip-knn';

describe('S43 same-label confidence shadow policy', () => {
  it('keeps same-label support from collapsing clear Basalt confidence', () => {
    const result = retrieveByCosine({
      queryEmbedding: normalizeVector([0, 1, 0, 0, 0, 0, 0, 0]),
      items: candidateIndex(),
      topK: 3,
    });

    expect(result.matches[0].item.id).toBe('photo-basalt-1');
    expect(result.matches[1].item.id).toBe('photo-basalt-vesicular-shade-support-1');
    expect(result.confidence).toBe('High');
  });

  it('keeps non-rock boundary safety conservative under same-label-aware confidence', () => {
    const result = retrieveByCosine({
      queryEmbedding: normalizeVector([0, 0.72, 0.7, 0, 0, 0, 0, 0]),
      items: candidateIndex(),
      topK: 5,
    });

    expect(result.matches[0].item.kind).toBe('rock');
    expect(result.possibleNonRock).toBe(true);
    expect(result.confidence).not.toBe('High');
  });
});

function candidateIndex(): VectorIndexItem[] {
  return [
    item('photo-basalt-1', 'Basalt', 'rock', [0, 1, 0, 0, 0, 0, 0, 0]),
    item('photo-basalt-vesicular-shade-support-1', 'Basalt', 'rock', [0, 0.6, 0.05, 0, 0, 0, 0, 0]),
    item('photo-slag-1', 'Slag', 'non-rock', [0, 0, 1, 0, 0, 0, 0, 0]),
    item('photo-asphalt-1', 'Asphalt', 'non-rock', [0, 0, 0, 0, 0, 1, 0, 0]),
    item('photo-coal-1', 'Coal', 'non-rock', [0, 0, 0, 0, 0, 0, 1, 0]),
  ];
}

function item(id: string, label: string, kind: VectorIndexItem['kind'], embedding: number[]): VectorIndexItem {
  return { id, label, kind, embedding: normalizeVector(embedding) };
}

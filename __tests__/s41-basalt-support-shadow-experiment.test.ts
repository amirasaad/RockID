import { describe, expect, it } from 'vitest';

import { normalizeVector, retrieveByCosine, type ClipKnnRetrievalResult, type VectorIndexItem } from '@/lib/clip-knn';

describe('S41 Basalt support shadow-index experiment', () => {
  it('classifies the rock-side Basalt support candidate as safe for shadow evidence only', () => {
    const shadowIndex = [
      item('photo-basalt-1', 'Basalt', 'rock', [0, 1, 0, 0, 0, 0, 0, 0]),
      item('photo-basalt-vesicular-shade-support-shadow', 'Basalt', 'rock', [0, 0.6, 0.1, 0, 0, 0, 0, 0]),
      item('photo-slag-1', 'Slag', 'non-rock', [0, 0, 1, 0, 0, 0, 0, 0]),
      item('photo-asphalt-1', 'Asphalt', 'non-rock', [0, 0, 0, 0, 0, 1, 0, 0]),
      item('photo-coal-1', 'Coal', 'non-rock', [0, 0, 0, 0, 0, 0, 1, 0]),
    ];

    const basaltBoundary = retrieveByCosine({
      queryEmbedding: normalizeVector([0, 0.75, 0.73, 0, 0, 0, 0, 0]),
      items: shadowIndex,
      topK: 3,
    });

    const slagBoundary = retrieveByCosine({
      queryEmbedding: normalizeVector([0, 0.65, 0.76, 0, 0, 0, 0, 0]),
      items: shadowIndex,
      topK: 3,
    });

    expect(top3Labels(basaltBoundary)).toContain('Basalt');
    expect(basaltBoundary.matches[0].item.id).toBe('photo-basalt-vesicular-shade-support-shadow');
    expect(basaltBoundary.confidence).not.toBe('High');

    expect(top3Labels(slagBoundary)).toContain('Slag');
    expect(slagBoundary.possibleNonRock).toBe(true);
    expect(slagBoundary.confidence).not.toBe('High');
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

function top3Labels(result: ClipKnnRetrievalResult): string[] {
  return result.matches.map((match) => match.item.label);
}

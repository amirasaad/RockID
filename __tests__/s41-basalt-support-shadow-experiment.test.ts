import { describe, expect, it } from 'vitest';

import { normalizeVector, retrieveByCosine, type ClipKnnRetrievalResult, type VectorIndexItem } from '@/lib/clip-knn';

describe('S41 Basalt support shadow-index experiment', () => {
  it('classifies the rock-side Basalt support candidate as safe for shadow evidence only', () => {
    const basaltBoundary = retrieveByCosine({
      queryEmbedding: normalizeVector([0, 0.75, 0.73, 0, 0, 0, 0, 0]),
      items: shadowIndex(),
      topK: 3,
    });

    const slagBoundary = retrieveByCosine({
      queryEmbedding: normalizeVector([0, 0.65, 0.76, 0, 0, 0, 0, 0]),
      items: shadowIndex(),
      topK: 3,
    });

    expect(top3Labels(basaltBoundary)).toContain('Basalt');
    expect(basaltBoundary.matches[0].item.id).toBe('photo-basalt-vesicular-shade-support-shadow');
    expect(basaltBoundary.confidence).not.toBe('High');

    expect(top3Labels(slagBoundary)).toContain('Slag');
    expect(slagBoundary.possibleNonRock).toBe(true);
    expect(slagBoundary.confidence).not.toBe('High');
  });

  it('keeps the paired S41 pack safe in a before/after shadow readout', () => {
    const readout = sprint41BoundaryQueries.map((query) => {
      const before = retrieveByCosine({
        queryEmbedding: normalizeVector(query.embedding),
        items: baselineIndex(),
        topK: 3,
      });
      const after = retrieveByCosine({
        queryEmbedding: normalizeVector(query.embedding),
        items: shadowIndex(),
        topK: 3,
      });

      return {
        ...query,
        before,
        after,
      };
    });

    expect(readout).toHaveLength(6);
    expect(readout.filter((row) => row.expectedKind === 'rock')).toHaveLength(3);
    expect(readout.filter((row) => row.expectedKind === 'non-rock')).toHaveLength(3);

    for (const row of readout) {
      expect(top3Labels(row.after)).toContain(row.expectedLabel);

      if (row.expectedKind === 'non-rock') {
        expect(isHighConfidenceRockClaim(row.after)).toBe(false);
      }
    }

    const basaltSlagBoundary = readout.find((row) => row.id === 's41-rock-basalt-vesicular-shade-a');
    expect(basaltSlagBoundary?.before.matches[0]?.item.id).toBe('photo-basalt-1');
    expect(basaltSlagBoundary?.after.matches[0]?.item.id).toBe('photo-basalt-vesicular-shade-support-shadow');
    expect(basaltSlagBoundary?.after.confidence).not.toBe('High');
  });
});

const sprint41BoundaryQueries = [
  query('s41-rock-basalt-vesicular-shade-a', 'Basalt', 'rock', [0, 0.75, 0.73, 0, 0, 0, 0, 0]),
  query('s41-non-rock-slag-rusty-vesicular-a', 'Slag', 'non-rock', [0, 0.65, 0.76, 0, 0, 0, 0, 0]),
  query('s41-rock-basalt-fresh-break-a', 'Basalt', 'rock', [0, 0.95, 0.05, 0, 0, 0, 0, 0]),
  query('s41-non-rock-asphalt-wet-aggregate-a', 'Asphalt', 'non-rock', [0, 0, 0, 0, 0, 1, 0, 0]),
  query('s41-rock-basalt-dull-massive-a', 'Basalt', 'rock', [0, 0.9, 0.1, 0, 0, 0, 0, 0]),
  query('s41-non-rock-coal-dull-fractured-a', 'Coal', 'non-rock', [0, 0, 0, 0, 0, 0, 1, 0]),
];

function baselineIndex(): VectorIndexItem[] {
  return [
    item('photo-basalt-1', 'Basalt', 'rock', [0, 1, 0, 0, 0, 0, 0, 0]),
    item('photo-slag-1', 'Slag', 'non-rock', [0, 0, 1, 0, 0, 0, 0, 0]),
    item('photo-asphalt-1', 'Asphalt', 'non-rock', [0, 0, 0, 0, 0, 1, 0, 0]),
    item('photo-coal-1', 'Coal', 'non-rock', [0, 0, 0, 0, 0, 0, 1, 0]),
  ];
}

function shadowIndex(): VectorIndexItem[] {
  return [
    item('photo-basalt-1', 'Basalt', 'rock', [0, 1, 0, 0, 0, 0, 0, 0]),
    item('photo-basalt-vesicular-shade-support-shadow', 'Basalt', 'rock', [0, 0.6, 0.1, 0, 0, 0, 0, 0]),
    item('photo-slag-1', 'Slag', 'non-rock', [0, 0, 1, 0, 0, 0, 0, 0]),
    item('photo-asphalt-1', 'Asphalt', 'non-rock', [0, 0, 0, 0, 0, 1, 0, 0]),
    item('photo-coal-1', 'Coal', 'non-rock', [0, 0, 0, 0, 0, 0, 1, 0]),
  ];
}

function query(id: string, expectedLabel: string, expectedKind: VectorIndexItem['kind'], embedding: number[]) {
  return {
    id,
    expectedLabel,
    expectedKind,
    embedding,
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

function top3Labels(result: ClipKnnRetrievalResult): string[] {
  return result.matches.map((match) => match.item.label);
}

function isHighConfidenceRockClaim(result: ClipKnnRetrievalResult): boolean {
  const top = result.matches[0];
  return top?.item.kind === 'rock' && result.confidence === 'High';
}

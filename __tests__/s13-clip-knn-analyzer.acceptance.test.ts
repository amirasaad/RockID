import { describe, expect, it } from 'vitest';

import type { IdentificationSession } from '@/lib/identification-session';
import { createClipKnnAnalyzer, normalizeVector, type VectorIndexItem } from '@/lib/clip-knn';

describe('S13 CLIP kNN analyzer acceptance', () => {
  it('adapts retrieval output into the analyzer contract (matches + topMatch)', () => {
    const analyzer = createClipKnnAnalyzer({
      embed: () => normalizeVector([1, 0, 0]),
      index: [
        item('granite-1', 'Granite', 'rock', [1, 0, 0]),
        item('slag-1', 'Slag', 'non-rock', [0.6, 0.8, 0]),
        item('basalt-1', 'Basalt', 'rock', [0.2, 0.98, 0]),
        item('obsidian-1', 'Obsidian', 'rock', [-1, 0, 0]),
      ],
      topK: 3,
    });

    const analysis = analyzer(session({ id: 'sess-1', uri: 'file:///field/example.jpg' }));

    expect(analysis.matches).toHaveLength(3);
    expect(analysis.topMatch).toEqual(analysis.matches[0]);
    expect(analysis.topMatch.name).toBe('Granite');
    expect(analysis.topMatch.score).toBeGreaterThanOrEqual(0);
    expect(analysis.topMatch.score).toBeLessThanOrEqual(100);
  });

  it('downgrades confidence when non-rock dominates the top results', () => {
    const analyzer = createClipKnnAnalyzer({
      embed: () => normalizeVector([1, 0, 0]),
      index: [
        item('slag-1', 'Slag', 'non-rock', [1, 0, 0]),
        item('concrete-1', 'Concrete', 'non-rock', [0.9, 0.1, 0]),
        item('basalt-1', 'Basalt', 'rock', [0.8, 0.2, 0]),
      ],
      topK: 3,
    });

    const analysis = analyzer(session({ id: 'sess-2', uri: 'file:///field/example.jpg' }));

    expect(analysis.topMatch.confidence).not.toBe('High');
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


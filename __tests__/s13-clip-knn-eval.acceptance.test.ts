import { describe, expect, it } from 'vitest';

import type { IdentificationSession } from '@/lib/identification-session';
import { createClipKnnAnalyzer, normalizeVector, type VectorIndexItem } from '@/lib/clip-knn';
import { evaluateRockIdentifier, type RockIdEvalFixture } from '@/lib/rock-id-eval';

describe('S13 CLIP kNN eval acceptance', () => {
  it('evaluates a CLIP kNN analyzer through the existing eval report contract', () => {
    const index: VectorIndexItem[] = [
      item('basalt-1', 'Basalt', 'rock', oneHot(20, 1)),
      item('granite-1', 'Granite', 'rock', oneHot(20, 0)),
      item('slag-1', 'Slag', 'non-rock', oneHot(20, 2)),
      item('obsidian-1', 'Obsidian', 'rock', oneHot(20, 3)),
    ];

    const analyzer = createClipKnnAnalyzer({
      index,
      topK: 3,
      embed: (session) => {
        if (session.id.includes('weak-evidence')) {
          return normalizeVector(Array.from({ length: 20 }, () => 1));
        }

        if (session.id.includes('granite')) return normalizeVector(oneHot(20, 0));
        if (session.id.includes('basalt')) return normalizeVector(oneHot(20, 1));
        if (session.id.includes('slag')) return normalizeVector(oneHot(20, 2));

        return normalizeVector(oneHot(20, 3));
      },
    });

    const fixtures: RockIdEvalFixture[] = [
      fixture({ id: 'granite-default', expectedLabel: 'Granite' }),
      fixture({ id: 'basalt-default', expectedLabel: 'Basalt' }),
      fixture({ id: 'weak-evidence', expectedLabel: 'Granite' }),
      fixture({ id: 'slag-lookalike', expectedLabel: 'Slag', expectedKind: 'non-rock' }),
    ];

    const report = evaluateRockIdentifier({
      fixtures,
      analyze: (session) => analyzer(session),
    });

    expect(report.total).toBe(4);
    expect(report.top1Accuracy).toBe(0.75);
    expect(report.top3Accuracy).toBe(1);
    expect(report.lowConfidenceRate).toBe(0.25);
    expect(report.nonRockFalsePositiveRate).toBe(0);
    expect(report.nonRockConfusions).toEqual([]);
  });
});

function oneHot(dimension: number, index: number): number[] {
  return Array.from({ length: dimension }, (_, position) => (position === index ? 1 : 0));
}

function item(id: string, label: string, kind: VectorIndexItem['kind'], embedding: number[]): VectorIndexItem {
  return {
    id,
    label,
    kind,
    embedding: normalizeVector(embedding),
  };
}

function fixture(input: {
  id: string;
  expectedLabel: string;
  expectedKind?: RockIdEvalFixture['expectedKind'];
}): RockIdEvalFixture {
  return {
    id: input.id,
    expectedLabel: input.expectedLabel,
    expectedKind: input.expectedKind ?? 'rock',
    session: session({ id: `session-${input.id}`, uri: `file:///eval/${input.id}.jpg` }),
  };
}

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
      color: '',
      grainSize: '',
      features: [],
      notes: '',
    },
    createdAt: 1,
    updatedAt: 1,
  };
}


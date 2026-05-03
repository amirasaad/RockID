import { describe, expect, it } from 'vitest';

import type { IdentificationSession } from '@/lib/identification-session';
import { createClipKnnAnalyzer, normalizeVector } from '@/lib/clip-knn';
import { toVectorIndexItems } from '@/lib/clip-index';
import { loadClipIndexFromFile } from '@/lib/clip-index-node';
import { evaluateRockIdentifier, type RockIdEvalFixture } from '@/lib/rock-id-eval';

describe('S13 CLIP kNN eval acceptance', () => {
  it('evaluates a CLIP kNN analyzer through the existing eval report contract', async () => {
    const clipIndex = await loadClipIndexFromFile('data/clip/demo-index.json');
    const index = toVectorIndexItems(clipIndex);

    const analyzer = createClipKnnAnalyzer({
      index,
      topK: 3,
      embed: (session) => {
        if (session.id.includes('weak-evidence')) {
          return normalizeVector(Array.from({ length: clipIndex.embeddingDimension }, () => 1));
        }

        if (session.id.includes('granite')) return normalizeVector(oneHot(clipIndex.embeddingDimension, 0));
        if (session.id.includes('basalt')) return normalizeVector(oneHot(clipIndex.embeddingDimension, 1));
        if (session.id.includes('slag')) return normalizeVector(oneHot(clipIndex.embeddingDimension, 2));

        return normalizeVector(oneHot(clipIndex.embeddingDimension, 3));
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

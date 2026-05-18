import { describe, expect, it } from 'vitest';

import {
  sprint41DarkBoundaryLabeledPack,
  type Sprint41DarkBoundarySample,
} from '@/data/eval/sprint41-dark-boundary-labeled-pack';
import {
  normalizeVector,
  retrieveByCosine,
  type ClipKnnRetrievalResult,
  type VectorIndexItem,
} from '@/lib/clip-knn';
import { photoIndex } from '@/lib/on-device-clip-knn-analysis';

describe('S46 Basalt boundary readout', () => {
  it('keeps the promoted Basalt support point useful but still cautious on the vesicular boundary', () => {
    const before = readBoundaryPack(productionIndexBeforeSprint45());
    const after = readBoundaryPack(photoIndex);

    expect(after).toHaveLength(6);
    expect(countBy(after.map((row) => row.sample.expectedKind))).toEqual({ rock: 3, 'non-rock': 3 });

    const vesicularBasalt = findReadout(after, 's41-rock-basalt-vesicular-shade-a');
    const previousVesicularBasalt = findReadout(before, 's41-rock-basalt-vesicular-shade-a');

    expect(previousVesicularBasalt.result.matches[0].item.id).toBe('photo-basalt-1');
    expect(vesicularBasalt.result.matches[0].item.id).toBe('photo-basalt-vesicular-shade-support-1');
    expect(top3Labels(vesicularBasalt.result)).toContain('Basalt');
    expect(vesicularBasalt.result.confidence).toBe('Low');
    expect(differentLabelMargin(vesicularBasalt.result)).toBeGreaterThan(
      differentLabelMargin(previousVesicularBasalt.result),
    );

    for (const row of after) {
      expect(top3Labels(row.result)).toContain(row.sample.expectedLabel);
      expect(isHighConfidenceWrongRockClaim(row)).toBe(false);

      if (row.sample.expectedKind === 'non-rock') {
        expect(isHighConfidenceRockClaim(row.result)).toBe(false);
      }
    }
  });
});

type BoundaryReadout = {
  sample: Sprint41DarkBoundarySample;
  result: ClipKnnRetrievalResult;
};

const boundaryEmbeddingsBySampleId: Record<string, number[]> = {
  's41-rock-basalt-vesicular-shade-a': [0, 0.75, 0.73, 0, 0, 0, 0, 0],
  's41-non-rock-slag-rusty-vesicular-a': [0, 0.65, 0.76, 0, 0, 0, 0, 0],
  's41-rock-basalt-fresh-break-a': [0, 0.95, 0.05, 0, 0, 0, 0, 0],
  's41-non-rock-asphalt-wet-aggregate-a': [0, 0, 0, 0, 0, 1, 0, 0],
  's41-rock-basalt-dull-massive-a': [0, 0.9, 0.1, 0, 0, 0, 0, 0],
  's41-non-rock-coal-dull-fractured-a': [0, 0, 0, 0, 0, 0, 1, 0],
};

function readBoundaryPack(index: VectorIndexItem[]): BoundaryReadout[] {
  return sprint41DarkBoundaryLabeledPack.map((sample) => ({
    sample,
    result: retrieveByCosine({
      queryEmbedding: normalizeVector(boundaryEmbeddingsBySampleId[sample.id]),
      items: index,
      topK: 3,
    }),
  }));
}

function productionIndexBeforeSprint45(): VectorIndexItem[] {
  return photoIndex.filter((item) => item.id !== 'photo-basalt-vesicular-shade-support-1');
}

function findReadout(readout: BoundaryReadout[], sampleId: string): BoundaryReadout {
  const row = readout.find((entry) => entry.sample.id === sampleId);
  if (!row) {
    throw new Error(`Missing boundary readout for ${sampleId}.`);
  }

  return row;
}

function top3Labels(result: ClipKnnRetrievalResult): string[] {
  return result.matches.map((match) => match.item.label);
}

function differentLabelMargin(result: ClipKnnRetrievalResult): number {
  const top = result.matches[0];
  const challenger = result.matches.find(
    (match) => match.item.label !== top?.item.label || match.item.kind !== top?.item.kind,
  );

  return (top?.score ?? -Infinity) - (challenger?.score ?? -Infinity);
}

function isHighConfidenceRockClaim(result: ClipKnnRetrievalResult): boolean {
  return result.matches[0]?.item.kind === 'rock' && result.confidence === 'High';
}

function isHighConfidenceWrongRockClaim(row: BoundaryReadout): boolean {
  return (
    row.result.matches[0]?.item.kind === 'rock' &&
    row.result.matches[0]?.item.label !== row.sample.expectedLabel &&
    row.result.confidence === 'High'
  );
}

function countBy(values: string[]): Record<string, number> {
  return values.reduce<Record<string, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

import { describe, expect, it } from 'vitest';

import {
  normalizeVector,
  retrieveByCosine,
  type ClipKnnRetrievalResult,
  type VectorIndexItem,
} from '@/lib/clip-knn';
import { photoIndex } from '@/lib/on-device-clip-knn-analysis';

describe('S47 Asphalt boundary readout', () => {
  it('keeps an ambiguous wet-asphalt known-answer sample away from confident Basalt', () => {
    const readout = retrieveByCosine({
      queryEmbedding: normalizeVector([0, 0.6, 0, 0, 0, 0.7, 0, 0]),
      items: photoIndex,
      topK: 3,
    });

    expect(readout.matches[0].item.id).toBe('photo-asphalt-1');
    expect(readout.matches[0].item.kind).toBe('non-rock');
    expect(top3Labels(readout)).toContain('Basalt');
    expect(top3Labels(readout)).toContain('Asphalt');
    expect(isHighConfidenceRockClaim(readout)).toBe(false);
    expect(readout.confidence).not.toBe('High');
    expect(nearestRockChallenger(readout)?.item.label).toBe('Basalt');
  });
});

function top3Labels(result: ClipKnnRetrievalResult): string[] {
  return result.matches.map((match) => match.item.label);
}

function isHighConfidenceRockClaim(result: ClipKnnRetrievalResult): boolean {
  return result.matches[0]?.item.kind === 'rock' && result.confidence === 'High';
}

function nearestRockChallenger(result: ClipKnnRetrievalResult): { item: VectorIndexItem; score: number } | undefined {
  return result.matches.find((match) => match.item.kind === 'rock');
}

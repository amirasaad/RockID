import { describe, expect, it } from 'vitest';

import { normalizeVector, retrieveByCosine, type RankedVectorIndexItem, type VectorIndexItem } from '@/lib/clip-knn';
import { getDefaultConfidenceThresholds } from '@/lib/confidence-thresholds';

describe('S43 same-label confidence shadow policy', () => {
  it('characterizes the S42 failure: same-label support currently collapses clear Basalt confidence', () => {
    const result = retrieveByCosine({
      queryEmbedding: normalizeVector([0, 1, 0, 0, 0, 0, 0, 0]),
      items: candidateIndex(),
      topK: 3,
    });

    expect(result.matches[0].item.id).toBe('photo-basalt-1');
    expect(result.matches[1].item.id).toBe('photo-basalt-vesicular-shade-support-1');
    expect(result.confidence).toBe('Low');
  });

  it('shows a shadow same-label-aware margin would treat support neighbors as corroboration, not opposition', () => {
    const result = retrieveByCosine({
      queryEmbedding: normalizeVector([0, 1, 0, 0, 0, 0, 0, 0]),
      items: candidateIndex(),
      topK: 3,
    });

    const shadow = calculateSameLabelAwareConfidence(result.matches, result.possibleNonRock);

    expect(shadow.nearestDifferentLabel?.item.label).not.toBe('Basalt');
    expect(shadow.marginAgainstDifferentLabel).toBeGreaterThan(0.9);
    expect(shadow.confidence).toBe('High');
  });

  it('keeps non-rock boundary safety conservative under the shadow readout', () => {
    const result = retrieveByCosine({
      queryEmbedding: normalizeVector([0, 0.72, 0.7, 0, 0, 0, 0, 0]),
      items: candidateIndex(),
      topK: 5,
    });

    const shadow = calculateSameLabelAwareConfidence(result.matches, result.possibleNonRock);

    expect(result.matches[0].item.kind).toBe('rock');
    expect(result.possibleNonRock).toBe(true);
    expect(shadow.confidence).not.toBe('High');
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

function calculateSameLabelAwareConfidence(matches: RankedVectorIndexItem[], possibleNonRock: boolean) {
  const topMatch = matches[0];
  const nearestDifferentLabel = matches.find(
    (match) => match.item.label !== topMatch?.item.label || match.item.kind !== topMatch?.item.kind
  );
  const marginAgainstDifferentLabel = (topMatch?.score ?? -Infinity) - (nearestDifferentLabel?.score ?? -Infinity);
  const thresholds = getDefaultConfidenceThresholds();

  let confidence = 'Low';
  if ((topMatch?.score ?? -Infinity) >= thresholds.high.minTopScore && marginAgainstDifferentLabel >= thresholds.high.minMargin) {
    confidence = 'High';
  } else if (
    (topMatch?.score ?? -Infinity) >= thresholds.medium.minTopScore &&
    marginAgainstDifferentLabel >= thresholds.medium.minMargin
  ) {
    confidence = 'Medium';
  }

  return {
    confidence: possibleNonRock && confidence === 'High' ? 'Medium' : confidence,
    marginAgainstDifferentLabel,
    nearestDifferentLabel,
  };
}

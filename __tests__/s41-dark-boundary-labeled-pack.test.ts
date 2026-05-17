import { describe, expect, it } from 'vitest';

import {
  sprint41DarkBoundaryFixtures,
  sprint41DarkBoundaryLabeledPack,
  type Sprint41BoundaryCluster,
} from '@/data/eval/sprint41-dark-boundary-labeled-pack';

describe('S41 dark-boundary labeled evidence pack', () => {
  it('defines paired Basalt vs dark non-rock boundary evidence before any index mutation', () => {
    expect(sprint41DarkBoundaryLabeledPack).toHaveLength(6);
    expect(sprint41DarkBoundaryFixtures).toHaveLength(sprint41DarkBoundaryLabeledPack.length);

    const kinds = countBy(sprint41DarkBoundaryLabeledPack.map((sample) => sample.expectedKind));
    expect(kinds).toEqual({ rock: 3, 'non-rock': 3 });

    const clusters = countBy(sprint41DarkBoundaryLabeledPack.map((sample) => sample.boundaryCluster));
    expect(clusters).toEqual({
      'basalt-vs-asphalt': 2,
      'basalt-vs-coal': 2,
      'basalt-vs-slag': 2,
    } satisfies Record<Sprint41BoundaryCluster, number>);
  });

  it('requires each sample to carry known-answer reporting context and conservative acceptance checks', () => {
    for (const sample of sprint41DarkBoundaryLabeledPack) {
      expect(sample.id).toMatch(/^s41-/);
      expect(sample.expectedLabel.length).toBeGreaterThan(0);
      expect(sample.sampleType.length).toBeGreaterThan(0);
      expect(sample.rationale.length).toBeGreaterThan(20);
      expect(sample.photoConditions).toEqual({
        lighting: expect.any(String),
        distance: expect.any(String),
        background: expect.any(String),
        surfaceState: expect.any(String),
      });
      expect(sample.acceptanceChecks.expectedTop3Label).toBe(sample.expectedLabel);
      expect(sample.acceptanceChecks.allowHighConfidenceWrongRock).toBe(false);
      expect(sample.acceptanceChecks.notes.length).toBeGreaterThan(20);
      expect(sample.fixture.id).toBe(sample.id);
      expect(sample.fixture.expectedLabel).toBe(sample.expectedLabel);
      expect(sample.fixture.expectedKind).toBe(sample.expectedKind);
      expect(sample.fixture.session.selectedPhoto?.uri).toContain('/eval/sprint41/');
      expect(sample.fixture.session.observations?.notes).toBeTruthy();
    }
  });

  it('keeps non-rock samples under an explicit no-confident-rock-claim policy', () => {
    const nonRockSamples = sprint41DarkBoundaryLabeledPack.filter((sample) => sample.expectedKind === 'non-rock');

    expect(nonRockSamples.map((sample) => sample.expectedLabel).sort()).toEqual(['Asphalt', 'Coal', 'Slag']);
    expect(nonRockSamples.every((sample) => sample.acceptanceChecks.confidencePolicy === 'reject-high-confidence-rock-claim')).toBe(
      true,
    );
  });
});

function countBy(values: string[]): Record<string, number> {
  return values.reduce<Record<string, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

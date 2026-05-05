import { describe, expect, it } from 'vitest';

import { starterEvalFixtures } from '@/data/eval/starter-fixtures';
import { analyzeIdentificationSession } from '@/lib/mock-analysis';
import { evaluateRockIdentifier } from '@/lib/rock-id-eval';

describe('S12 dataset eval expansion acceptance', () => {
  it('reports class coverage and non-rock confusion from reusable eval fixtures', () => {
    const report = evaluateRockIdentifier({
      fixtures: starterEvalFixtures,
      analyze: analyzeIdentificationSession,
    });

    expect(report.total).toBe(16);
    expect(report.coverage).toEqual({
      classes: {
        Basalt: 1,
        Brick: 1,
        Concrete: 1,
        Conglomerate: 1,
        Glass: 1,
        Gneiss: 1,
        Granite: 2,
        Limestone: 1,
        Marble: 1,
        Obsidian: 1,
        Quartzite: 1,
        Sandstone: 1,
        Shale: 1,
        Slate: 1,
        Slag: 1,
      },
      kinds: {
        rock: 12,
        'non-rock': 4,
      },
    });
    expect(report.perClassAccuracy.Granite).toEqual({
      total: 2,
      top1Accuracy: 0.5,
      top3Accuracy: 0.5,
    });
    expect(report.perClassAccuracy.Slag).toEqual({
      total: 1,
      top1Accuracy: 0,
      top3Accuracy: 0,
    });
    expect(report.nonRockConfusions).toContainEqual({
      expected: 'Slag',
      predicted: 'Basalt',
      count: 1,
      sampleIds: ['slag-bubbly-dark'],
    });
  });
});

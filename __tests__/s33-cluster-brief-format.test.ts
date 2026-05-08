import { describe, expect, it } from 'vitest';

import { formatFailureClusterBrief } from '@/lib/detection-cluster-brief';
import type { FailureCluster } from '@/lib/detection-failure-clusters';

describe('S33 cluster brief formatting', () => {
  it('formats numbered cluster lines with capped sample ids', () => {
    const clusters: FailureCluster[] = [
      {
        expected: 'Glass',
        predicted: 'Granite',
        count: 3,
        sampleIds: ['g-1', 'g-2', 'g-3', 'g-4'],
      },
      {
        expected: 'Asphalt',
        predicted: 'Basalt',
        count: 2,
        sampleIds: ['a-1', 'a-2'],
      },
    ];

    const brief = formatFailureClusterBrief({ clusters, maxSampleIdsPerCluster: 2 });

    expect(brief).toBe(
      '1. Glass → Granite (3) [g-1, g-2 ... (+2 more)]\n' +
        '2. Asphalt → Basalt (2) [a-1, a-2]'
    );
  });

  it('returns a stable empty-state message when no clusters are provided', () => {
    expect(formatFailureClusterBrief({ clusters: [] })).toBe('No failure clusters selected.');
  });
});

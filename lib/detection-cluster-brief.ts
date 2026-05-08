import type { FailureCluster } from './detection-failure-clusters';

/**
 * Formats selected failure clusters into stable planning lines that can be pasted into sprint notes.
 */
export function formatFailureClusterBrief(input: { clusters: FailureCluster[]; maxSampleIdsPerCluster?: number }): string {
  const maxSampleIdsPerCluster = Math.max(1, input.maxSampleIdsPerCluster ?? 3);
  if (input.clusters.length === 0) return 'No failure clusters selected.';

  return input.clusters
    .map((cluster, index) => {
      const visible = cluster.sampleIds.slice(0, maxSampleIdsPerCluster);
      const suffix =
        cluster.sampleIds.length > maxSampleIdsPerCluster
          ? ` ... (+${cluster.sampleIds.length - maxSampleIdsPerCluster} more)`
          : '';
      return `${index + 1}. ${cluster.expected} → ${cluster.predicted} (${cluster.count}) [${visible.join(', ')}${suffix}]`;
    })
    .join('\n');
}

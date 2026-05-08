#!/usr/bin/env node
import { readFileSync } from 'node:fs';

function parseArgs(argv) {
  const args = {
    report: '',
    maxClusters: 3,
    maxSampleIds: 3,
  };

  for (let index = 2; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--report') {
      args.report = argv[++index] ?? '';
      continue;
    }
    if (token === '--max-clusters') {
      args.maxClusters = Number(argv[++index] ?? '3');
      continue;
    }
    if (token === '--max-samples') {
      args.maxSampleIds = Number(argv[++index] ?? '3');
      continue;
    }
  }

  return args;
}

function assertReportShape(report) {
  if (!report || typeof report !== 'object') {
    throw new Error('Report must be a JSON object.');
  }

  if (!Array.isArray(report.topConfusions) || !Array.isArray(report.confusionPairs)) {
    throw new Error('Report must include array fields: topConfusions and confusionPairs.');
  }
}

function selectTopFailureClusters(input) {
  const maxClusters = Math.max(0, input.maxClusters);
  if (maxClusters === 0) return [];

  const source = input.report.topConfusions.length > 0 ? input.report.topConfusions : input.report.confusionPairs;
  return sortConfusions(source).slice(0, maxClusters).map((pair) => ({
    expected: pair.expected,
    predicted: pair.predicted,
    count: pair.count,
    sampleIds: [...pair.sampleIds].sort((left, right) => left.localeCompare(right)),
  }));
}

function formatFailureClusterBrief(input) {
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

function sortConfusions(confusions) {
  return [...confusions].sort((left, right) => {
    const byCount = right.count - left.count;
    if (byCount !== 0) return byCount;
    const byExpected = left.expected.localeCompare(right.expected);
    if (byExpected !== 0) return byExpected;
    return left.predicted.localeCompare(right.predicted);
  });
}

function run() {
  const args = parseArgs(process.argv);

  if (!args.report) {
    throw new Error('Usage: node scripts/print-failure-cluster-brief.mjs --report <path> [--max-clusters 3] [--max-samples 3]');
  }

  const raw = readFileSync(args.report, 'utf8');
  const report = JSON.parse(raw);
  assertReportShape(report);

  const clusters = selectTopFailureClusters({
    report,
    maxClusters: args.maxClusters,
  });

  const brief = formatFailureClusterBrief({
    clusters,
    maxSampleIdsPerCluster: args.maxSampleIds,
  });

  process.stdout.write(`${brief}\n`);
}

try {
  run();
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
}

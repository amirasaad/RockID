import type { IdentificationSession } from './identification-session';
import type { RockMatch } from './mock-data';

export type RockIdEvalFixture = {
  id: string;
  expectedLabel: string;
  expectedKind: 'rock' | 'non-rock';
  session: IdentificationSession;
};

export type RockIdAnalyzerResult = {
  matches: RockMatch[];
  topMatch: RockMatch;
};

export type RockIdAnalyzer = (session: IdentificationSession) => RockIdAnalyzerResult;
export type RockIdAnalyzerAsync = (session: IdentificationSession) => Promise<RockIdAnalyzerResult>;

export type RockIdConfusionPair = {
  expected: string;
  predicted: string;
  count: number;
  sampleIds: string[];
};

export type RockIdClassAccuracy = {
  total: number;
  top1Accuracy: number;
  top3Accuracy: number;
};

export type RockIdEvalReport = {
  total: number;
  top1Accuracy: number;
  top3Accuracy: number;
  lowConfidenceRate: number;
  lowConfidenceSampleIds: string[];
  nonRockFalsePositiveRate: number;
  confusionPairs: RockIdConfusionPair[];
  topConfusions: RockIdConfusionPair[];
  nonRockConfusions: RockIdConfusionPair[];
  perClassAccuracy: Record<string, RockIdClassAccuracy>;
  coverage: {
    classes: Record<string, number>;
    kinds: Record<RockIdEvalFixture['expectedKind'], number>;
  };
};


export type RockIdCoverageGaps = {
  lowCoverageClasses: string[];
  missingNonRockLabels: string[];
};

export function findCoverageGaps(
  report: RockIdEvalReport,
  options: {
    minSamplesPerClass: number;
    requiredNonRockLabels: string[];
  }
): RockIdCoverageGaps {
  const minSamplesPerClass = Math.max(1, options.minSamplesPerClass);

  const lowCoverageClasses = Object.entries(report.coverage.classes)
    .filter(([, count]) => count < minSamplesPerClass)
    .map(([label]) => label)
    .sort((left, right) => left.localeCompare(right));

  const observedLabels = new Set(Object.keys(report.coverage.classes));
  const missingNonRockLabels = options.requiredNonRockLabels
    .filter((label) => !observedLabels.has(label))
    .sort((left, right) => left.localeCompare(right));

  return {
    lowCoverageClasses,
    missingNonRockLabels,
  };
}


export type RockIdEvalSummaryOptions = {
  maxConfusions?: number;
  maxNonRockConfusions?: number;
  maxLowConfidenceSamples?: number;
  maxSamplesPerConfusion?: number;
  coverageGapMinSamplesPerClass?: number;
  coverageGapRequiredNonRockLabels?: string[];
};

type RockIdEvalResult = {
  fixture: RockIdEvalFixture;
  analysis: RockIdAnalyzerResult;
  top1Correct: boolean;
  top3Correct: boolean;
  lowConfidence: boolean;
};

/**
 * Formats an eval report into a stable, human-readable summary string for QA logs.
 * @param report - Report returned by evaluateRockIdentifier / evaluateRockIdentifierAsync.
 * @param options - Formatting options.
 * @returns Multi-line summary with headline metrics and top confusions (including fixture ids).
 */
export function formatRockIdEvalSummary(
  report: RockIdEvalReport,
  options?: RockIdEvalSummaryOptions
): string {
  const maxConfusions = options?.maxConfusions ?? 10;
  const maxNonRockConfusions = options?.maxNonRockConfusions ?? 10;
  const maxLowConfidenceSamples = options?.maxLowConfidenceSamples ?? 10;
  const maxSamplesPerConfusion = options?.maxSamplesPerConfusion ?? 10;

  const lines: string[] = [];
  lines.push(`Total: ${report.total}`);
  lines.push(`Coverage kinds: rock=${report.coverage.kinds.rock}, non-rock=${report.coverage.kinds['non-rock']}`);
  lines.push(`Coverage classes: ${formatCoverageClasses(report.coverage.classes)}`);
  lines.push(`Top-1: ${formatPercent(report.top1Accuracy)}`);
  lines.push(`Top-3: ${formatPercent(report.top3Accuracy)}`);
  lines.push(`Low confidence: ${formatPercent(report.lowConfidenceRate)}`);
  lines.push(`Low-confidence samples: ${formatSampleList(report.lowConfidenceSampleIds, maxLowConfidenceSamples)}`);
  lines.push(`Non-rock false positives: ${formatPercent(report.nonRockFalsePositiveRate)}`);

  const coverageGapLine = formatCoverageGapSummaryLine(report, options);
  if (coverageGapLine) {
    lines.push(coverageGapLine);
  }

  lines.push('Top confusions:');
  lines.push(...formatConfusionLines(report.confusionPairs, maxConfusions, maxSamplesPerConfusion));

  lines.push('Non-rock confusions:');
  lines.push(...formatConfusionLines(report.nonRockConfusions, maxNonRockConfusions, maxSamplesPerConfusion));

  return lines.join('\n');
}

export function evaluateRockIdentifier(input: {
  fixtures: RockIdEvalFixture[];
  analyze: RockIdAnalyzer;
}): RockIdEvalReport {
  const results = input.fixtures.map((fixture) => evaluateFixture(fixture, input.analyze));
  const total = results.length;
  const nonRockResults = results.filter((result) => result.fixture.expectedKind === 'non-rock');

  return {
    total,
    top1Accuracy: ratio(countWhere(results, 'top1Correct'), total),
    top3Accuracy: ratio(countWhere(results, 'top3Correct'), total),
    lowConfidenceRate: ratio(countWhere(results, 'lowConfidence'), total),
    lowConfidenceSampleIds: collectLowConfidenceSampleIds(results),
    nonRockFalsePositiveRate: calculateNonRockFalsePositiveRate(nonRockResults),
    confusionPairs: collectConfusionPairs(results),
    topConfusions: collectConfusionPairs(results),
    nonRockConfusions: collectConfusionPairs(nonRockResults),
    perClassAccuracy: calculatePerClassAccuracy(results),
    coverage: calculateCoverage(input.fixtures),
  };
}

export async function evaluateRockIdentifierAsync(input: {
  fixtures: RockIdEvalFixture[];
  analyze: RockIdAnalyzerAsync;
}): Promise<RockIdEvalReport> {
  const results = await Promise.all(input.fixtures.map((fixture) => evaluateFixtureAsync(fixture, input.analyze)));
  const total = results.length;
  const nonRockResults = results.filter((result) => result.fixture.expectedKind === 'non-rock');

  return {
    total,
    top1Accuracy: ratio(countWhere(results, 'top1Correct'), total),
    top3Accuracy: ratio(countWhere(results, 'top3Correct'), total),
    lowConfidenceRate: ratio(countWhere(results, 'lowConfidence'), total),
    lowConfidenceSampleIds: collectLowConfidenceSampleIds(results),
    nonRockFalsePositiveRate: calculateNonRockFalsePositiveRate(nonRockResults),
    confusionPairs: collectConfusionPairs(results),
    topConfusions: collectConfusionPairs(results),
    nonRockConfusions: collectConfusionPairs(nonRockResults),
    perClassAccuracy: calculatePerClassAccuracy(results),
    coverage: calculateCoverage(input.fixtures),
  };
}

function evaluateFixture(fixture: RockIdEvalFixture, analyze: RockIdAnalyzer): RockIdEvalResult {
  const analysis = analyze(fixture.session);

  return {
    fixture,
    analysis,
    top1Correct: analysis.topMatch.name === fixture.expectedLabel,
    top3Correct: analysis.matches.slice(0, 3).some((match) => match.name === fixture.expectedLabel),
    lowConfidence: analysis.topMatch.confidence === 'Low',
  };
}

async function evaluateFixtureAsync(fixture: RockIdEvalFixture, analyze: RockIdAnalyzerAsync): Promise<RockIdEvalResult> {
  const analysis = await analyze(fixture.session);

  return {
    fixture,
    analysis,
    top1Correct: analysis.topMatch.name === fixture.expectedLabel,
    top3Correct: analysis.matches.slice(0, 3).some((match) => match.name === fixture.expectedLabel),
    lowConfidence: analysis.topMatch.confidence === 'Low',
  };
}

function ratio(count: number, total: number): number {
  if (total === 0) return 0;
  return count / total;
}

function countWhere(results: RockIdEvalResult[], key: keyof Pick<RockIdEvalResult, 'top1Correct' | 'top3Correct' | 'lowConfidence'>): number {
  return results.filter((result) => result[key]).length;
}

function calculateNonRockFalsePositiveRate(results: RockIdEvalResult[]): number {
  const falsePositives = results.filter((result) => !result.top1Correct).length;
  return ratio(falsePositives, results.length);
}

function collectLowConfidenceSampleIds(results: RockIdEvalResult[]): string[] {
  return results
    .filter((result) => result.lowConfidence)
    .map((result) => result.fixture.id)
    .sort((left, right) => left.localeCompare(right));
}

function collectConfusionPairs(results: RockIdEvalResult[]): RockIdConfusionPair[] {
  const counts = new Map<string, RockIdConfusionPair>();

  for (const result of results) {
    if (result.top1Correct) continue;

    const expected = result.fixture.expectedLabel;
    const predicted = result.analysis.topMatch.name;
    const key = `${expected}\u0000${predicted}`;
    const existing = counts.get(key);

    counts.set(key, {
      expected,
      predicted,
      count: existing ? existing.count + 1 : 1,
      sampleIds: existing ? [...existing.sampleIds, result.fixture.id] : [result.fixture.id],
    });
  }

  return [...counts.values()].map((pair) => ({
    ...pair,
    sampleIds: [...pair.sampleIds].sort((left, right) => left.localeCompare(right)),
  }));
}

function calculatePerClassAccuracy(results: RockIdEvalResult[]): Record<string, RockIdClassAccuracy> {
  const byClass = groupClassScores(results);

  return Object.fromEntries(
    sortedEntries(byClass).map(([expectedLabel, score]) => [
      expectedLabel,
      {
        total: score.total,
        top1Accuracy: ratio(score.top1Correct, score.total),
        top3Accuracy: ratio(score.top3Correct, score.total),
      },
    ])
  );
}

function groupClassScores(results: RockIdEvalResult[]): Map<string, { total: number; top1Correct: number; top3Correct: number }> {
  const byClass = new Map<string, { total: number; top1Correct: number; top3Correct: number }>();

  for (const result of results) {
    const expectedLabel = result.fixture.expectedLabel;
    const current = byClass.get(expectedLabel) ?? {
      total: 0,
      top1Correct: 0,
      top3Correct: 0,
    };

    current.total += 1;
    if (result.top1Correct) current.top1Correct += 1;
    if (result.top3Correct) current.top3Correct += 1;

    byClass.set(expectedLabel, current);
  }

  return byClass;
}

function calculateCoverage(fixtures: RockIdEvalFixture[]): RockIdEvalReport['coverage'] {
  const classes = new Map<string, number>();
  const kinds: Record<RockIdEvalFixture['expectedKind'], number> = {
    rock: 0,
    'non-rock': 0,
  };

  for (const fixture of fixtures) {
    classes.set(fixture.expectedLabel, (classes.get(fixture.expectedLabel) ?? 0) + 1);
    kinds[fixture.expectedKind] += 1;
  }

  return {
    classes: Object.fromEntries(sortedEntries(classes)),
    kinds,
  };
}

function sortedEntries<Value>(map: Map<string, Value>): Array<[string, Value]> {
  return [...map.entries()].sort(([left], [right]) => left.localeCompare(right));
}

/**
 * Formats a ratio in [0, 1] as a percentage string with one decimal place.
 * @param ratioValue - Ratio in [0, 1].
 * @returns Percent string, e.g. "25.0%".
 */
function formatPercent(ratioValue: number): string {
  const clamped = Math.min(1, Math.max(0, ratioValue));
  return `${(clamped * 100).toFixed(1)}%`;
}

/**
 * Formats confusion pairs into a stable bullet list, sorted by count descending and label ascending.
 * @param pairs - Confusion pair list.
 * @param maxPairs - Maximum number of pairs to include.
 * @param maxSamplesPerPair - Maximum number of sample ids to show per pair.
 * @returns Bullet lines, or a single "- None" line when empty.
 */
function formatConfusionLines(pairs: RockIdConfusionPair[], maxPairs: number, maxSamplesPerPair: number): string[] {
  if (pairs.length === 0) return ['- None'];

  const sorted = [...pairs].sort((left, right) => {
    const byCount = right.count - left.count;
    if (byCount !== 0) return byCount;
    const byExpected = left.expected.localeCompare(right.expected);
    if (byExpected !== 0) return byExpected;
    return left.predicted.localeCompare(right.predicted);
  });

  return sorted.slice(0, Math.max(0, maxPairs)).map((pair) => {
    const samples = pair.sampleIds.length > 0 ? ` [${formatSampleList(pair.sampleIds, maxSamplesPerPair)}]` : '';
    return `- ${pair.expected} → ${pair.predicted} (${pair.count})${samples}`;
  });
}

/**
 * Formats a stable sample-id list for summary output.
 * @param sampleIds - Sample ids to print.
 * @param maxSampleIds - Maximum number of ids to include before truncating.
 * @returns "None" when empty, otherwise a comma-separated list.
 */
function formatSampleList(sampleIds: string[], maxSampleIds: number): string {
  if (sampleIds.length === 0) return 'None';
  const capped = sampleIds.slice(0, Math.max(0, maxSampleIds));
  if (sampleIds.length <= capped.length) {
    return capped.join(', ');
  }

  return `${capped.join(', ')} ... (+${sampleIds.length - capped.length} more)`;
}

/**
 * Formats class coverage counts as a stable comma-separated list.
 * @param classes - Coverage map keyed by expected label.
 * @returns Readable class summary, or "None" when empty.
 */
function formatCoverageGapSummaryLine(report: RockIdEvalReport, options?: RockIdEvalSummaryOptions): string | null {
  const minSamplesPerClass = options?.coverageGapMinSamplesPerClass;
  const requiredNonRockLabels = options?.coverageGapRequiredNonRockLabels;
  if (!minSamplesPerClass || !requiredNonRockLabels) return null;

  const coverageGaps = findCoverageGaps(report, {
    minSamplesPerClass,
    requiredNonRockLabels,
  });

  return `Coverage gaps: low=${formatCoverageGapList(coverageGaps.lowCoverageClasses, 10)}, missing non-rock=${formatCoverageGapList(coverageGaps.missingNonRockLabels, 10)}`;
}

function formatCoverageGapList(values: string[], maxItems: number): string {
  if (values.length === 0) return 'None';
  if (values.length <= maxItems) return values.join(' | ');

  const visible = values.slice(0, maxItems).join(' | ');
  const hiddenCount = values.length - maxItems;
  return `${visible} ... (+${hiddenCount} more)`;
}

function formatCoverageClasses(classes: Record<string, number>): string {
  const entries = Object.entries(classes).sort(([left], [right]) => left.localeCompare(right));
  if (entries.length === 0) return 'None';
  return entries.map(([label, count]) => `${label}=${count}`).join(', ');
}

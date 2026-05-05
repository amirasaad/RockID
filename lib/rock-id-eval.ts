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
  nonRockFalsePositiveRate: number;
  confusionPairs: RockIdConfusionPair[];
  nonRockConfusions: RockIdConfusionPair[];
  perClassAccuracy: Record<string, RockIdClassAccuracy>;
  coverage: {
    classes: Record<string, number>;
    kinds: Record<RockIdEvalFixture['expectedKind'], number>;
  };
};

type RockIdEvalResult = {
  fixture: RockIdEvalFixture;
  analysis: RockIdAnalyzerResult;
  top1Correct: boolean;
  top3Correct: boolean;
  lowConfidence: boolean;
};

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
    nonRockFalsePositiveRate: calculateNonRockFalsePositiveRate(nonRockResults),
    confusionPairs: collectConfusionPairs(results),
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
    nonRockFalsePositiveRate: calculateNonRockFalsePositiveRate(nonRockResults),
    confusionPairs: collectConfusionPairs(results),
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
    });
  }

  return [...counts.values()];
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

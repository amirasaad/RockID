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

export function evaluateRockIdentifier(input: {
  fixtures: RockIdEvalFixture[];
  analyze: RockIdAnalyzer;
}): RockIdEvalReport {
  const results = input.fixtures.map((fixture) => {
    const analysis = input.analyze(fixture.session);
    return {
      fixture,
      analysis,
      top1Correct: analysis.topMatch.name === fixture.expectedLabel,
      top3Correct: analysis.matches.some((match) => match.name === fixture.expectedLabel),
      lowConfidence: analysis.topMatch.confidence === 'Low',
    };
  });

  const total = results.length;

  return {
    total,
    top1Accuracy: ratio(results.filter((result) => result.top1Correct).length, total),
    top3Accuracy: ratio(results.filter((result) => result.top3Correct).length, total),
    lowConfidenceRate: ratio(results.filter((result) => result.lowConfidence).length, total),
    nonRockFalsePositiveRate: calculateNonRockFalsePositiveRate(results),
    confusionPairs: collectConfusionPairs(results),
    nonRockConfusions: collectConfusionPairs(
      results.filter((result) => result.fixture.expectedKind === 'non-rock')
    ),
    perClassAccuracy: calculatePerClassAccuracy(results),
    coverage: calculateCoverage(input.fixtures),
  };
}

function ratio(count: number, total: number): number {
  if (total === 0) return 0;
  return count / total;
}

function calculateNonRockFalsePositiveRate(
  results: Array<{
    fixture: RockIdEvalFixture;
    top1Correct: boolean;
  }>
): number {
  const nonRockResults = results.filter((result) => result.fixture.expectedKind === 'non-rock');
  const falsePositives = nonRockResults.filter((result) => !result.top1Correct).length;
  return ratio(falsePositives, nonRockResults.length);
}

function collectConfusionPairs(
  results: Array<{
    fixture: RockIdEvalFixture;
    analysis: RockIdAnalyzerResult;
    top1Correct: boolean;
  }>
): RockIdConfusionPair[] {
  const counts = new Map<string, RockIdConfusionPair>();

  for (const result of results) {
    if (result.top1Correct) continue;

    const expected = result.fixture.expectedLabel;
    const predicted = result.analysis.topMatch.name;
    const key = `${expected}\u0000${predicted}`;
    const existing = counts.get(key);

    if (existing) {
      existing.count += 1;
    } else {
      counts.set(key, { expected, predicted, count: 1 });
    }
  }

  return [...counts.values()];
}


function calculatePerClassAccuracy(
  results: Array<{
    fixture: RockIdEvalFixture;
    top1Correct: boolean;
    top3Correct: boolean;
  }>
): Record<string, RockIdClassAccuracy> {
  const byClass = new Map<
    string,
    {
      total: number;
      top1Correct: number;
      top3Correct: number;
    }
  >();

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

  return Object.fromEntries(
    [...byClass.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([expectedLabel, score]) => [
        expectedLabel,
        {
          total: score.total,
          top1Accuracy: ratio(score.top1Correct, score.total),
          top3Accuracy: ratio(score.top3Correct, score.total),
        },
      ])
  );
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
    classes: Object.fromEntries([...classes.entries()].sort(([left], [right]) => left.localeCompare(right))),
    kinds,
  };
}

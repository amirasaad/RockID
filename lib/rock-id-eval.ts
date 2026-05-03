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

export type RockIdEvalReport = {
  total: number;
  top1Accuracy: number;
  top3Accuracy: number;
  lowConfidenceRate: number;
  nonRockFalsePositiveRate: number;
  confusionPairs: RockIdConfusionPair[];
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

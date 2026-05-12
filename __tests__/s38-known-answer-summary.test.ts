import { describe, expect, it } from 'vitest';

import { parseAttemptLog, summarizeMarkdown } from '../scripts/summarize-known-answer-qa.mjs';

const markdown = "| Attempt | Date | Tester | Sample Group | Expected Answer | Shown Top Match | Top-3 Includes Expected? | Confidence Band | Photo Conditions | Useful? | Saved/Reopened? | Issue | Status | Notes |\n| ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n| 1 | 2026-05-12 | A | Clear rock | basalt | basalt | Yes | Medium | shade | useful | yes | #10 | Pass | |\n| 2 | 2026-05-12 | A | Clear rock | sandstone | granite | No | High | bright | misleading | yes | #11 | Fail | |\n| 3 | 2026-05-12 | A | Non-rock confuser | non-rock glass | obsidian | N/A | High | indoor | misleading | no | #12 | Fail | |\n| 4 | | | Clear rock | granite | | | | | | | | | |\n";

describe('known-answer QA summary', () => {
  it('parses attempt rows and ignores incomplete rows', () => {
    const attempts = parseAttemptLog(markdown);

    expect(attempts).toHaveLength(4);
    expect(attempts.filter((attempt: { completed: boolean }) => attempt.completed)).toHaveLength(3);
  });

  it('summarizes Sprint 38 trust gates from the attempt log', () => {
    const summary = summarizeMarkdown(markdown);

    expect(summary.completedAttempts).toBe(3);
    expect(summary.knownRockAttempts).toBe(2);
    expect(summary.nonRockConfuserAttempts).toBe(1);
    expect(summary.top3UsefulKnownRockAttempts).toBe(1);
    expect(summary.highConfidenceWrongRockIds).toBe(1);
    expect(summary.highConfidenceNonRockClaims).toBe(1);
    expect(summary.gates.confidentWrong).toBe(false);
    expect(summary.gates.nonRockRejection).toBe(false);
    expect(summary.failures.highConfidenceWrongRockIds).toEqual([2]);
    expect(summary.failures.highConfidenceNonRockClaims).toEqual([3]);
  });
});

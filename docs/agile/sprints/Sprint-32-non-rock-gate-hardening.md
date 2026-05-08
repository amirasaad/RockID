# Sprint 32 — Non-Rock Gate Hardening

## Goal
Increase trust in strong rock detection by expanding non-rock confuser coverage and enforcing explicit conservative pass/fail gates.

## Stories
| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S32-1` | As the team, non-rock coverage includes richer confuser variants. | Fixture set includes slag, glass, concrete, brick, plastic plus lighting/background confusers. | Must |
| `S32-2` | As the team, detection gates are explicit and testable. | Gate checks include non-rock false-positive ceiling, low-confidence floor, and confusion visibility. | Must |
| `S32-3` | As the team, gate regressions are caught before release. | Baseline-aware no-regression checks for top-1/top-3 are implemented and tested. | Must |

## Scope Delivered
- Added expanded fixture set for non-rock hardening in [data/eval/sprint32-non-rock-gate-fixtures.ts](<../../../data/eval/sprint32-non-rock-gate-fixtures.ts>).
- Added explicit detection gate evaluator in [lib/rock-id-detection-gates.ts](<../../../lib/rock-id-detection-gates.ts>).
- Added acceptance coverage in:
  - [__tests__/s32-detection-gate-hardening.acceptance.test.ts](<../../../__tests__/s32-detection-gate-hardening.acceptance.test.ts>)
  - [__tests__/s32-non-rock-gate-fixture-shape.test.ts](<../../../__tests__/s32-non-rock-gate-fixture-shape.test.ts>)

## Gate Defaults
- `maxNonRockFalsePositiveRate <= 0.15`
- `minLowConfidenceRate >= 0.10`
- `minTopConfusionCount >= 1`
- With baseline: `top1Drop <= 0.03`, `top3Drop <= 0.02`

## QA Notes
- Keep confidence thresholds unchanged unless a gate fails.
- If a gate fails, prefer one bounded adjustment and immediate re-eval.

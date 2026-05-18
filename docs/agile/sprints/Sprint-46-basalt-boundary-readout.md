# Sprint 46 - Basalt Boundary Readout

## Goal
Measure whether the Sprint 45 Basalt support point improves the dark Basalt boundary without adding another production behavior change.

## Stories
| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S46-1` | As the team, we compare current production behavior against the pre-Sprint-45 boundary baseline. | The readout covers the six-sample Sprint 41 Basalt vs Slag / Asphalt / Coal pack. | Must |
| `S46-2` | As the team, we keep non-rock rejection conservative. | Known non-rock confusers produce zero high-confidence rock claims. | Must |
| `S46-3` | As the team, we document whether S45 helped enough to keep. | Detection readout states keep, rollback, or gather more evidence. | Must |
| `S46-4` | As the team, we wire the readout into detection gates. | `verify:detection-gates` and `verify:expanded-eval` include the S46 readout. | Should |

## Acceptance Gates
- No production analyzer, threshold, UI, API, or result-contract changes.
- Basalt remains visible in Top-3 for rock-side boundary samples.
- Non-rock dark confusers produce zero high-confidence rock claims.
- `pnpm verify:detection-gates` must pass.
- `pnpm verify:expanded-eval` must pass before merge.
- `pnpm verify:release-builds` must pass before merge to `main`.

## Evidence
- [Sprint 46 Basalt Boundary Readout](../../detection/Sprint-46-Basalt-Boundary-Readout.md)
- [Sprint 45 Basalt Support Index Promotion](<Sprint-45-basalt-support-index-promotion.md>)
- [Sprint 41 Dark Boundary Labeled Pack](../../detection/Sprint-41-Dark-Boundary-Labeled-Pack.md)

## Current Progress
- `S46-1`: Added production-vs-pre-S45 boundary readout coverage.
- `S46-2`: Readout asserts zero high-confidence rock claims on known non-rock dark confusers.
- `S46-3`: Readout decision documented.
- `S46-4`: S46 readout added to detection and expanded eval gate scripts.

## Gate Evidence
- `pnpm vitest run __tests__/s46-basalt-boundary-readout.test.ts`: passed, 1 file / 1 test.
- `pnpm typecheck`: passed.
- `pnpm verify:detection-gates`: passed, 10 files / 17 tests.
- `pnpm verify:expanded-eval`: passed, 17 files / 29 tests.
- `pnpm verify:release-builds`: pending before merge to `main`.

## Decision
Keep the S45 Basalt support point. Sprint 46 is a readout sprint only; no new production behavior is promoted.

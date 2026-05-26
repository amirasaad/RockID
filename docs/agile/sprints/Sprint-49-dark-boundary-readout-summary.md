# Sprint 49 - Dark Boundary Readout Summary

## Goal
Close the synthetic dark-boundary readout arc and decide the next evidence source before changing analyzer behavior again.

## Stories
| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S49-1` | As the team, we summarize the S46-S48 dark-boundary evidence chain. | Summary references Basalt, Asphalt, and Coal readouts and their observed confidence posture. | Must |
| `S49-2` | As the team, we make an explicit stop/go decision. | The sprint states no production behavior change and names real known-answer dark-confuser evidence as the next input. | Must |
| `S49-3` | As the team, we preserve existing detection gates. | Existing S46-S48 readouts remain included in standing eval scripts. | Must |
| `S49-4` | As the team, we update the live agile board. | Kanban and epic milestones reflect Sprint 48 completion and Sprint 49 in progress. | Should |

## Acceptance Gates
- No production analyzer, threshold, UI, API, index, or result-contract changes.
- S46-S48 readouts remain in `verify:detection-gates` and `verify:expanded-eval`.
- Summary explicitly rejects another synthetic row as the default next step.
- `pnpm vitest run __tests__/s49-dark-boundary-readout-summary.test.ts` must pass.
- `pnpm typecheck` must pass.
- `pnpm verify:detection-gates` must pass.
- `pnpm verify:expanded-eval` must pass before merge.
- `pnpm verify:release-builds` must pass before merge to `main`.

## Evidence
- [Sprint 49 Dark Boundary Readout Summary](../../detection/Sprint-49-Dark-Boundary-Readout-Summary.md)
- [Sprint 48 Coal Boundary Readout](../../detection/Sprint-48-Coal-Boundary-Readout.md)
- [Sprint 47 Asphalt Boundary Readout](../../detection/Sprint-47-Asphalt-Boundary-Readout.md)
- [Sprint 46 Basalt Boundary Readout](../../detection/Sprint-46-Basalt-Boundary-Readout.md)

## Current Progress
- `S49-1`: Added the S46-S48 dark-boundary summary.
- `S49-2`: Documented no production behavior change and real known-answer evidence as next input.
- `S49-3`: Added a guard test for summary content and S46-S48 gate continuity.
- `S49-4`: Updated Kanban and Epic milestones.

## Gate Evidence
- `pnpm vitest run __tests__/s49-dark-boundary-readout-summary.test.ts`: passed, 1 file / 2 tests.
- `pnpm typecheck`: passed.
- `pnpm verify:detection-gates`: passed, 13 files / 21 tests.
- `pnpm verify:expanded-eval`: passed, 20 files / 33 tests.
- `pnpm verify:release-builds`: passed with iOS and Android bundle/native checks before merge to `main`.

## Decision
No production behavior change. The next detection-quality input should be a real known-answer dark-confuser photo candidate, not another synthetic readout by default.

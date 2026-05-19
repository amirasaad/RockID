# Sprint 48 - Coal Boundary Readout

## Goal
Add one readout-only known-answer pressure case for ambiguous dull Coal near the Basalt boundary, without changing production behavior.

## Stories
| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S48-1` | As the team, we add one Coal-side readout row. | The new test covers an ambiguous dull-coal embedding with Basalt nearby in Top-3. | Must |
| `S48-2` | As the team, we preserve non-rock rejection quality. | The sample remains Top-1 non-rock and produces zero high-confidence rock claims. | Must |
| `S48-3` | As the team, we wire the readout into standing detection gates. | `verify:detection-gates` and `verify:expanded-eval` include the S48 readout. | Must |
| `S48-4` | As the team, we document the next evidence-first slice. | Sprint close names the next candidate step without promoting new production behavior. | Should |

## Acceptance Gates
- No production analyzer, threshold, UI, API, index, or result-contract changes.
- Ambiguous dull Coal stays Top-1 non-rock.
- Basalt may appear as a challenger, but not as a high-confidence rock claim.
- `pnpm verify:detection-gates` must pass.
- `pnpm verify:expanded-eval` must pass before merge.
- `pnpm verify:release-builds` must pass before merge to `main`.

## Evidence
- [Sprint 48 Coal Boundary Readout](../../detection/Sprint-48-Coal-Boundary-Readout.md)
- [Sprint 47 Asphalt Boundary Readout](../../detection/Sprint-47-Asphalt-Boundary-Readout.md)
- [Sprint 46 Basalt Boundary Readout](../../detection/Sprint-46-Basalt-Boundary-Readout.md)
- [Sprint 41 Dark Boundary Labeled Pack](../../detection/Sprint-41-Dark-Boundary-Labeled-Pack.md)

## Current Progress
- `S48-1`: Added the Coal-side readout row.
- `S48-2`: Readout asserts Top-1 non-rock and no high-confidence rock claim.
- `S48-3`: S48 readout added to detection and expanded eval gate scripts.
- `S48-4`: Next slice documented as real known-answer dark-confuser evidence or an arc summary.

## Gate Evidence
- `pnpm vitest run __tests__/s48-coal-boundary-readout.test.ts`: passed, 1 file / 1 test.
- `pnpm typecheck`: passed.
- `pnpm verify:detection-gates`: passed, 12 files / 19 tests.
- `pnpm verify:expanded-eval`: passed, 19 files / 31 tests.
- `pnpm verify:release-builds`: pending before merge to `main`.

## Decision
Keep S48 as readout-only evidence. Do not promote new production behavior.

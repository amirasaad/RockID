# Sprint 47 - Asphalt Boundary Readout

## Goal
Add one readout-only known-answer pressure case for ambiguous wet asphalt near the Basalt boundary, without changing production behavior.

## Stories
| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S47-1` | As the team, we add one Asphalt-side readout row. | The new test covers an ambiguous wet-asphalt embedding with Basalt nearby in Top-3. | Must |
| `S47-2` | As the team, we preserve non-rock rejection quality. | The sample remains Top-1 non-rock and produces zero high-confidence rock claims. | Must |
| `S47-3` | As the team, we wire the readout into standing detection gates. | `verify:detection-gates` and `verify:expanded-eval` include the S47 readout. | Must |
| `S47-4` | As the team, we document the next evidence-first slice. | Sprint close names the next candidate boundary without promoting new production behavior. | Should |

## Acceptance Gates
- No production analyzer, threshold, UI, API, index, or result-contract changes.
- Ambiguous wet asphalt stays Top-1 non-rock.
- Basalt may appear as a challenger, but not as a high-confidence rock claim.
- `pnpm verify:detection-gates` must pass.
- `pnpm verify:expanded-eval` must pass before merge.
- `pnpm verify:release-builds` must pass before merge to `main`.

## Evidence
- [Sprint 47 Asphalt Boundary Readout](../../detection/Sprint-47-Asphalt-Boundary-Readout.md)
- [Sprint 46 Basalt Boundary Readout](../../detection/Sprint-46-Basalt-Boundary-Readout.md)
- [Sprint 41 Dark Boundary Labeled Pack](../../detection/Sprint-41-Dark-Boundary-Labeled-Pack.md)

## Current Progress
- `S47-1`: Added the Asphalt-side readout row.
- `S47-2`: Readout asserts Top-1 non-rock and no high-confidence rock claim.
- `S47-3`: S47 readout added to detection and expanded eval gate scripts.
- `S47-4`: Next slice documented as Coal-side or real known-answer dark-confuser evidence.

## Gate Evidence
- `pnpm vitest run __tests__/s47-asphalt-boundary-readout.test.ts`: passed, 1 file / 1 test.
- `pnpm typecheck`: passed.
- `pnpm verify:detection-gates`: passed, 11 files / 18 tests.
- `pnpm verify:expanded-eval`: passed, 18 files / 30 tests.
- `pnpm verify:release-builds`: pending before merge to `main`.

## Decision
Keep S47 as readout-only evidence. Do not promote new production behavior.

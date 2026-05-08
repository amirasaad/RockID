# Sprint 34 — Calibration Stability Pass

## Goal
Re-run full expanded eval, verify stability against Sprint 32 baseline, and lock release-candidate stop/go criteria.

## Stories
| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S34-1` | As the team, expanded eval remains stable across runs. | Full fixture suite re-run confirms no unacceptable regression from Sprint 32 baseline. | Must |
| `S34-2` | As the team, confidence policy remains conservative near non-rock boundaries. | Non-rock-adjacent outcomes avoid overconfident mislabeling. | Must |
| `S34-3` | As the team, release-candidate decision is explicit. | Stop/go checklist is documented and linked from milestone evidence. | Must |

## Status
- `S34-1` In progress (`evaluateCalibrationStability` comparator + dedicated verification test added).
- `S34-2` In progress (boundary-policy acceptance tests added for non-rock-adjacent conservative confidence behavior).
- `S34-3` Pending (release-candidate stop/go checklist lock).

## Planned Exit Criteria
- `pnpm verify:release-builds` passes.
- Detection gate passes with baseline-aware regression checks.
- Release-candidate checklist documented in sprint notes and Epic Milestones.

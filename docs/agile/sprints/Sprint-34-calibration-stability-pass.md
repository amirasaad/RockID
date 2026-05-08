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
- `S34-3` Completed (release-candidate stop/go checklist documented and linked for milestone handoff). 

## Planned Exit Criteria
- `pnpm verify:release-builds` passes.
- Detection gate passes with baseline-aware regression checks.
- Release-candidate checklist documented in sprint notes and Epic Milestones.


## Release Candidate Stop/Go Checklist
- `GO` only if all are true:
- `pnpm verify:release-builds` passes.
- `pnpm verify:detection-gates` passes with baseline-aware regression checks.
- `pnpm verify:calibration-stability` passes.
- Top confusion report remains populated for next-sprint targeting (`topConfusions.length >= 1`).
- No high-confidence overclaim on non-rock-adjacent boundary-policy acceptance tests.

- `STOP` if any of the following occur:
- Non-rock false positive gate fails.
- Top-1 or Top-3 regression exceeds Sprint 32 tolerance.
- Calibration stability check fails.

- Default response when stopped:
- Roll back to last passing analyzer config and open next sprint with one narrower hypothesis.

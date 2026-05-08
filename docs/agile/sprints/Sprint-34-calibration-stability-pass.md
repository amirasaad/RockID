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
- `S34-1` Completed (`verify:expanded-eval` passed: 9 files / 16 tests on May 8, 2026).
- `S34-2` Completed (`verify:calibration-stability` and boundary-policy acceptance checks passed on May 8, 2026).
- `S34-3` Completed (decision recorded: `GO` after `verify:release-builds` passed on May 8, 2026).

## Planned Exit Criteria
- `pnpm verify:release-builds` passes.
- Detection gate passes with baseline-aware regression checks.
- Release-candidate checklist documented in sprint notes and Epic Milestones.

## Evidence Snapshot
- `pnpm verify:expanded-eval` -> Pass (9 files / 16 tests).
- `pnpm verify:detection-gates` -> Pass.
- `pnpm verify:failure-clusters` -> Pass.
- `pnpm verify:calibration-stability` -> Pass.
- `pnpm verify:release-builds` -> Pass (iOS and Android builds succeeded on May 8, 2026).

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
- Release build gate does not pass.

- Default response when stopped:
- Roll back to last passing analyzer config and open next sprint with one narrower hypothesis.

## Decision
- Current outcome: `GO` (all detection and release gates passed).
- Decision date: May 8, 2026.

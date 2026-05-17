# Sprint 42 - Production Index Decision

## Goal
Use Sprint 41's paired shadow evidence to make one careful production-index decision for the dark Basalt boundary. The sprint is not broad tuning; it is one measured index-data candidate with an explicit rollback path.

## Stories
| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S42-1` | As the team, we select exactly one production candidate from Sprint 41 evidence. | Candidate references the S41 labeled pack, expected delta, and rollback criteria. | Must |
| `S42-2` | As the team, we apply at most one index-data mutation. | Production analyzer/index data changes in one bounded place only; no threshold/UI changes. | Must |
| `S42-3` | As the team, we compare before/after behavior against S32/S37/S40/S41 gates. | Detection gates show no high-confidence non-rock failures and no unacceptable Top-3 regression. | Must |
| `S42-4` | As the team, we document stop/go for broader testing. | Sprint close states promote, rollback, or keep shadow-only with evidence. | Should |

## Acceptance Gates
- No confidence threshold changes.
- No product API or result contract changes.
- Non-rock high-confidence rock claims remain blocked.
- `pnpm verify:detection-gates` must pass.
- `pnpm verify:expanded-eval` must pass before merge.
- `pnpm verify:release-builds` must pass before merge to `main`.

## Starting Evidence
- [Sprint 41 Dark Boundary Labeled Pack](../../detection/Sprint-41-Dark-Boundary-Labeled-Pack.md)
- [Sprint 41 Shadow Candidate 2 Plan](../../detection/Sprint-41-Shadow-Candidate-2-Plan.md)

## Default Candidate
Default candidate: a Basalt-side support neighbor derived from `s41-rock-basalt-vesicular-shade-a`.

Default rollback:
- Revert the index-data mutation if any known non-rock guard becomes a high-confidence rock claim.
- Revert if Basalt is no longer visible in Top-3 for the S41 rock-side boundary samples.
- Revert if existing S32/S37/S40 gates regress.

## Guardrails
- One variable only.
- Prefer uncertainty over overclaiming.
- If the candidate needs threshold changes to pass, reject it and keep the behavior shadow-only.

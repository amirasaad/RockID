# Sprint 41 - Dark Boundary Labeled Evidence

## Goal
Turn the Sprint 40 negative shadow-index result into better evidence. The next useful step is not another production index tweak; it is a small labeled evidence pack for dark Basalt vs Slag / Asphalt / Coal boundaries.

## Stories
| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S41-1` | As the team, Sprint 40's unsafe shadow candidate is preserved as evidence. | Sprint 40 readout remains linked and clearly says Shadow Candidate 1 is not promoted. | Must |
| `S41-2` | As the team, we define the minimum labeled boundary pack. | The pack names sample types, expected labels, photo conditions, and acceptance checks before any index mutation. | Must |
| `S41-3` | As the team, we add only fixture/evidence scaffolding first. | No production analyzer, threshold, or UI behavior changes happen before the labeled evidence pack is reviewed. | Must |
| `S41-4` | As the team, we choose the next shadow candidate from evidence. | One rock-side or paired-boundary candidate is selected with expected delta and rollback criteria. | Should |

## Acceptance Gates
- No production index-data mutation until the labeled pack exists.
- No confidence threshold changes.
- Keep S32/S37/S40 detection gates green.
- `pnpm verify:release-builds` must pass before any sprint-worthy merge.

## Current Progress
- `S41-1`: Sprint 40 readout remains linked and explicitly says Shadow Candidate 1 is not promoted.
- `S41-2`: Minimum labeled boundary pack defined in [Sprint 41 Dark Boundary Labeled Pack](../../detection/Sprint-41-Dark-Boundary-Labeled-Pack.md).
- `S41-3`: Added fixture/evidence scaffolding plus shape tests only; no production analyzer, threshold, UI, or index behavior changed.
- `S41-4`: Next candidate selected as a rock-side Basalt support shadow test in [Sprint 41 Shadow Candidate 2 Plan](../../detection/Sprint-41-Shadow-Candidate-2-Plan.md).
- `S41-4`: Candidate 2 is now measured in shadow mode only; Basalt and Slag remain visible in Top-3 and no high-confidence rock claim is made on the Slag guard.
- `S41-4`: Paired before/after readout now covers all six S41 labeled samples and keeps detection gates green.

## Starting Evidence
- [Sprint 40 Dark Confuser Readout](../../detection/Sprint-40-Dark-Confuser-Readout.md)
- [Sprint 41 Dark Boundary Labeled Pack](../../detection/Sprint-41-Dark-Boundary-Labeled-Pack.md)
- [Sprint 41 Shadow Candidate 2 Plan](../../detection/Sprint-41-Shadow-Candidate-2-Plan.md)
- Shadow Candidate 1: unsafe to promote because a single Slag boundary neighbor flips a known low-margin Basalt fixture to non-rock Top-1.

## Guardrails
- Tiny steps only.
- Favor paired evidence over isolated vectors.
- Prefer honest uncertainty over overconfident Basalt claims.

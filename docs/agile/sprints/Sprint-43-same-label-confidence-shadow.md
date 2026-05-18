# Sprint 43 - Same-Label Confidence Shadow

## Goal
Investigate the Sprint 42 rollback signal without changing production behavior. The sprint asks whether confidence should compare a top rock against the nearest different label/kind, instead of treating same-label support neighbors as opposition.

## Stories
| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S43-1` | As the team, we preserve the Sprint 42 regression as a characterization test. | Test shows the Basalt support candidate makes current raw-margin confidence collapse to `Low`. | Must |
| `S43-2` | As the team, we model one same-label-aware confidence readout in shadow only. | Test-only readout treats same-label Basalt support as corroboration while leaving production retrieval unchanged. | Must |
| `S43-3` | As the team, we keep non-rock boundary safety conservative. | Shadow readout does not create a high-confidence rock claim when a non-rock neighbor is close. | Must |
| `S43-4` | As the team, we decide whether the next sprint should implement a production policy change. | Sprint close states implement, reject, or gather more real embeddings. | Should |

## Acceptance Gates
- No production analyzer/index mutation in this sprint.
- No confidence threshold changes.
- No app API or result contract changes.
- `pnpm verify:detection-gates` must pass.
- `pnpm verify:expanded-eval` must pass before merge.
- `pnpm verify:release-builds` must pass before merge to `main`.

## Starting Evidence
- [Sprint 42 Production Index Decision](../../detection/Sprint-42-Production-Index-Decision.md)
- [Sprint 42 sprint close](<Sprint-42-production-index-decision.md>)

## Hypothesis
The unsafe part of Sprint 42 was not the idea of a Basalt support neighbor by itself. The unsafe part was the current confidence margin: top score minus second score. If the second score is the same label and same kind, it may be evidence for the same answer, not evidence against it.

## Current Progress
- `S43-1`: Added a characterization test for current raw-margin confidence collapse.
- `S43-2`: Added a test-only same-label-aware shadow readout.
- `S43-3`: Added a non-rock boundary safety check for the shadow readout.
- `S43-4`: Pending after gates.

## Decision
Pending. Default posture remains conservative: do not promote the policy unless expanded eval and release-build gates stay green.

# Sprint 37 — Evidence-Based Detection Hardening

## Goal
Use beta wrong-result evidence to harden detection with tiny, measurable fixture and analyzer changes.

## Stories
| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S37-1` | As the team, beta wrong-result clusters become reviewable eval candidates. | Top reproducible clusters from Sprint 36 are promoted into small fixture slices with source notes. | Must |
| `S37-2` | As the team, detection improves through one bounded change. | At most one analyzer/calibration variable changes and the delta is measured against Sprint 34 baseline. | Must |
| `S37-3` | As a tester, the app avoids overclaiming near non-rock boundaries. | Non-rock false-positive and low-confidence behavior gates stay green. | Must |
| `S37-4` | As the team, the next confusion target is visible. | Eval report includes top confusions for the following sprint or wave. | Should |

## Planned Exit Criteria
- `pnpm verify:detection-gates` passes.
- `pnpm verify:release-builds` passes before merge.
- No top-1/top-3 regression beyond Sprint 34 tolerance.
- Fixture additions are small, sourced from beta evidence, and documented.

## Evidence To Capture
- Fixture source notes linked back to GitHub beta issues.
- Baseline-vs-delta report.
- Non-rock false-positive, low-confidence, and top-confusion metrics.

## Guardrails
- No multi-variable tuning.
- Prefer uncertainty over overconfident wrong labels.
- Roll back to last passing config if gates fail.

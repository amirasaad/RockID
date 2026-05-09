# Sprint 36 — Beta Feedback Triage + Fast Fixes

## Goal
Turn Wave 1 feedback into prioritized product themes and fix only the clearest high-impact blockers.

## Stories
| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S36-1` | As the team, beta reports are grouped into actionable themes. | Wave 1 issues are summarized by install friction, crash/blocker, UX confusion, and wrong-result clusters. | Must |
| `S36-2` | As a tester, high-priority blockers are addressed quickly. | `beta-priority-high` issues are fixed in-wave or explicitly deferred with a reason. | Must |
| `S36-3` | As the team, detection changes remain evidence-gated. | Confidence thresholds stay unchanged unless a reproduced wrong-result issue proves a safety regression. | Must |
| `S36-4` | As the team, retest guidance is clear. | Weekly changelog issue lists fixed items, investigating items, and tester retest asks. | Should |

## Planned Exit Criteria
- All high-priority beta issues are resolved or explicitly deferred.
- Product fixes pass focused regression checks plus `pnpm verify:release-builds`.
- Wrong-result clusters have enough detail to decide whether Sprint 37 fixtures are warranted.

## Evidence To Capture
- Issue theme summary.
- High-priority issue resolution/defer decisions.
- Retest changelog issue.
- Release-build gate evidence.

## Guardrails
- Fix one product risk at a time.
- Avoid broad UX rewrites during the beta wave.
- Keep offline-only scope and GitHub-only feedback intake unchanged.

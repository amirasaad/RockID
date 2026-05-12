# Sprint 38 — Known-Answer Detection Trust Decision

## Goal
Close the current beta arc with a known-answer Android QA decision: prove whether RockID is useful and honest on samples where the expected answer is already known.

This sprint is not a broad tuning sprint. The milestone bar is **Trustworthy Beta**: useful Top-3 behavior, zero confident wrong claims, and strong non-rock rejection before we invite broader testing.

## Stories
| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S38-1` | As the team, testers have known-answer missions for Android QA. | Mission guide covers clear rocks, ambiguous rocks, non-rock confusers, and save/reopen/reanalyze with expected-answer capture. | Must |
| `S38-2` | As the team, known-answer evidence is tracked consistently. | Each completed attempt records expected answer, shown `topMatch`, alternatives, confidence band, photo conditions, and usefulness. | Must |
| `S38-3` | As the team, beta trust gates are evaluated explicitly. | Summary reports known-answer count, Top-3 usefulness, confident wrong cases, non-rock false positives, and triage SLA. | Must |
| `S38-4` | As the team, the next distribution/detection decision is documented. | Decision is one of: broaden friends beta, run another known-answer pass, or pause/soften detection claims until a blocker is fixed. | Must |
| `S38-5` | As the team, next sprint starts from evidence. | Any proposed analyzer/calibration change references a reproduced issue or fixture slice, with at most one bounded detection change planned. | Should |

## Acceptance Gates
- Known-answer sample count: at least **20 completed attempts**.
- Top-3 usefulness target: at least **70% expected answer in Top-3** across known rock samples.
- Confident wrong target: **0 high-confidence wrong rock IDs**.
- Non-rock target: **0 high-confidence rock claims** on known non-rock confusers.
- Triage target: **100% of beta reports labeled and assigned to the Wave milestone within 24h**.
- Release target: `pnpm verify:release-builds` remains green before any beta-worthy merge.

## Evidence To Capture
- Known-answer attempt table or issue summary.
- Top-1 and Top-3 observed behavior.
- Confident wrong cases, if any.
- Non-rock false positives, if any.
- Top confusion clusters promoted to fixture candidates.
- Distribution decision for the next beta wave.

## Planned Exit Criteria
- Known-answer QA guide is published for testers.
- Wave 1 / Sprint 38 trust summary is complete.
- Detection trust decision is documented with pass/fail gates.
- Kanban and Epic Milestones reflect the outcome.

## Guardrails
- No app API changes.
- Android remains the active beta platform.
- iOS TestFlight stays deferred until Apple Developer team access exists.
- Do not make analyzer/calibration changes from anecdotes alone; promote reproduced cases to eval fixtures first.
- Favor honest uncertainty over confident wrong identification.

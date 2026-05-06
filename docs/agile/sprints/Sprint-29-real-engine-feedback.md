# **Sprint 29: Real Engine Feedback Loop**

Sprint goal:
Turn real-engine usage into measurable learning by making user feedback and analyzer diagnostics easy to review.

Planning date:
2026-05-06

## **Epic Alignment**

| Epic | Milestone | Sprint Contribution |
| --- | --- | --- |
| `E8: Field-Test Learning` | Feedback produces actionable trust signals | Capture wrong/uncertain result feedback with enough context to improve eval fixtures. |
| `E13: Engine Feedback Loop` | Real-engine outputs can be reviewed without cloud services | Store local diagnostics and feedback summaries for field QA. |
| `E11: Real Engine Integration` | Default engine remains safe after launch | Use feedback to decide whether thresholds/dataset need updates. |

## **Sprint Stories**

| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S29-1` | As a tester, I can mark a result as wrong or uncertain with useful context. | Feedback captures result usefulness, top match, confidence, engine diagnostics, and optional note. | Must |
| `S29-2` | As the team, we can review local real-engine feedback. | A local summary/view-model or debug export lists recent feedback by confidence and suspected issue. | Must |
| `S29-3` | As the team, feedback can become eval candidates. | Docs define when feedback becomes a curated eval fixture candidate, not training data by default. | Should |

## **Quality Gates**

- Unit/view-model tests for feedback summary behavior.
- Existing result feedback tests remain green.
- No network/backend dependency is introduced.
- Manual web/iPhone feedback smoke is recorded.

## **Tracking**

| Story | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `S29-1` | `Done` | [result-feedback.ts](<../../../lib/result-feedback.ts>), [result-feedback-context.tsx](<../../../lib/result-feedback-context.tsx>), [results.tsx](<../../../app/results.tsx>), [s29-real-engine-feedback.acceptance.test.ts](<../../../__tests__/s29-real-engine-feedback.acceptance.test.ts>), [s29-feedback-classification.test.ts](<../../../__tests__/s29-feedback-classification.test.ts>), [s29-feedback-note.acceptance.test.ts](<../../../__tests__/s29-feedback-note.acceptance.test.ts>) | Implemented wrong/uncertain classification with diagnostics context and note normalization; red/green/refactor commits recorded. |
| `S29-2` | `Done` | [feedback-summary.ts](<../../../lib/feedback-summary.ts>), [s29-feedback-summary.test.ts](<../../../__tests__/s29-feedback-summary.test.ts>) | Local summary view-model implemented with choice/confidence grouping and review candidates sorted newest first. |
| `S29-3` | `Done` | [Sprint-29-real-engine-feedback.md](<Sprint-29-real-engine-feedback.md>) | Candidate policy is defined below; handoff to Sprint 30 for fixture curation. |


## **DoD Evidence**

- `❌ test-fail(feedback): capture real-engine feedback context` (`1478e9f`)
- `✅ test-pass(feedback): persist real-engine feedback context` (`6931f99`)
- `❌ test-fail(feedback): classify not-useful by confidence` (`cd598f0`)
- `✅ test-pass(feedback): classify not-useful feedback by confidence` (`e4a7a12`)
- `📦 refactor(feedback): extract results feedback payload helper` (`d48e02f`)
- `✨ feat(feedback): add red acceptance test for note normalization` (`5b41fab`)
- `✅ test-pass(feedback): normalize blank feedback notes` (`5caf545`)
- Validation: targeted S29/S8 feedback Vitest suite passes and `pnpm run typecheck` passes on this story branch.

- `❌ test-fail(feedback): add local feedback summary view-model spec` (`a7155c9`)
- `✅ test-pass(feedback): add local feedback summary view-model` (`29e6f23`)
- `📋 agile(s29): align s29-2 branch and tracking` (`a59f974`)


## **Feedback Candidate Policy**

- Goal: turn local user feedback into reviewable eval candidates, not automatic training data.
- Candidate include rule: feedback choice is `wrong` or `uncertain` and has analysis context (`topMatch`, `confidence`, diagnostics engine).
- Candidate priority: `wrong` with `High` or `Medium` confidence first, then `uncertain` with `Low` confidence.
- Candidate quality requirement: keep entries with meaningful note text when present; blank notes are normalized away and do not block candidacy.
- Exclude rule: `useful` feedback is not an eval candidate by default.
- Exclude rule: entries without analysis context are excluded from fixture queue and kept only for local telemetry.
- Curation gate: a human reviewer must confirm label intent and classify each candidate as `fixture_add`, `fixture_update`, or `no_action`.
- Data handling: candidate records are local-first and do not imply cloud upload or model training.
- Sprint 30 handoff: promote only reviewer-approved candidates into curated eval fixtures with explicit source notes.

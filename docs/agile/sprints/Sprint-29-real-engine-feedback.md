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
| `S29-1` | `Backlog` | TBD | Start after Sprint 28 release gate is stable. |
| `S29-2` | `Backlog` | TBD | Keep local-first. |
| `S29-3` | `Backlog` | TBD | Sync with dataset policy in Sprint 30. |

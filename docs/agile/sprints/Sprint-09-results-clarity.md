# **Sprint 9: Results Clarity (Low-Confidence First)**

Sprint goal:
Make low-confidence Results states explicit and actionable so users see uncertainty early and can quickly gather better evidence.

Planning date:
2026-05-02

## **Sprint Stories**

| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S9-1` | As a user, I can clearly see when a result is low confidence and use a primary `Add Another Photo` action to improve evidence before saving. | Results show a low-confidence banner above fold; trust copy explains one-photo limitation; `Add Another Photo` routes to capture tips; save and feedback remain available. | Must |
| `S9-2` | As the team, we can track low-confidence result engagement and add-photo intent. | `low_confidence_result_viewed` and `low_confidence_add_photo_tapped` analytics events are emitted. | Must |
| `S9-3` | As a developer, low-confidence clarity logic is testable outside UI rendering details. | Confidence-to-variant behavior is covered by unit tests. | Should |

## **Definition Of Done Checkpoint**

| DoD Criterion | Current State |
| --- | --- |
| Low-confidence banner visible above fold | `Yes` |
| Primary `Add Another Photo` action routes to capture tips | `Yes` |
| Save and feedback remain available | `Yes` |
| Low-confidence analytics events emitted | `Yes` |
| `pnpm run typecheck` passes | `Yes` |
| Relevant tests pass | `Yes` |
| Manual validation documented | `Yes` |
| No MVP requirement conflicts | `Yes` |

## **Sprint 9 Tracking**

| Story | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `S9-1` | `Done` | [low-confidence-results.spec.ts](<../../../e2e/low-confidence-results.spec.ts>), [results.tsx](<../../../app/results.tsx>) | Low-confidence variant validated on web and iPhone |
| `S9-2` | `Done` | [analytics.ts](<../../../lib/analytics.ts>), [s4-analytics.acceptance.test.ts](<../../../__tests__/s4-analytics.acceptance.test.ts>) | Low-confidence analytics events emitted and validated |
| `S9-3` | `Done` | [results-clarity.ts](<../../../lib/results-clarity.ts>), [s9-results-clarity.test.ts](<../../../__tests__/s9-results-clarity.test.ts>) | Confidence variant helper covered by unit tests |

## **Manual QA Plan**

- Verify low-confidence banner and trust copy on web.
- Verify `Add Another Photo` navigates to capture tips on web.
- Verify save and feedback controls remain available in low-confidence state.
- Repeat checks on iPhone before marking `S9-1` done.


Manual QA log (`S9-1`):

- Date: 2026-05-02
- Scope: Low-confidence Results clarity, add-photo route, save/feedback availability
- Platforms: Web, iPhone
- Validation: Low-confidence banner and trust copy visible, `Add Another Photo` routes to capture tips, save and feedback paths remain available
- Automated evidence: [low-confidence-results.spec.ts](<../../../e2e/low-confidence-results.spec.ts>), [core-flow.spec.ts](<../../../e2e/core-flow.spec.ts>), [s9-results-clarity.test.ts](<../../../__tests__/s9-results-clarity.test.ts>)

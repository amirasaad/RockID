# **Sprint 8: Field-Test Readiness**

Sprint goal:
Make the MVP ready for real-world field testing by defining success signals and adding a lightweight feedback path from completed identification results.

Planning date:
2026-05-02

## **Sprint Intent**

The MVP loop works locally and has been tested on web and iPhone. This sprint shifts us from "can the flow run?" to "can we learn from real field use?" without jumping ahead into larger V1 features.

## **Sprint Stories**

| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S8-1` | As a field tester, I can mark whether a result was useful after viewing top 3 matches so the team can measure MVP trust and usefulness. | Result screen includes a small feedback prompt; user can choose a useful/not useful signal; feedback is stored in session-safe app state or local persistence; a follow-up state thanks the user; existing result/save flow still works. | Must |
| `S8-2` | As the product team, we have documented field-test success signals before collecting feedback so results can be interpreted consistently. | Success signals are documented; manual QA path is documented; Kanban and epic tracking reflect the active measurement slice. | Must |
| `S8-3` | As a developer, I can start the feedback feature with a failing acceptance or unit test before implementation. | A red test describes the intended feedback behavior; green implementation follows; refactor pass keeps handlers small and typed. | Must |

## **Acceptance Test Starter**

Begin with the smallest failing test that proves the user can submit result feedback.

Candidate test:

- Given a completed result with `top 3 matches`
- When the user marks the result as useful
- Then the app records the feedback and shows a thank-you state without removing the ability to save to collection

## **Field-Test Success Signals**

Track these during manual testing and future instrumentation:

| Signal | Target For MVP Field Test | Why It Matters |
| --- | --- | --- |
| First result completion | Tester can reach results from camera or upload without help | Confirms the core loop is usable |
| Result usefulness | Tester can say whether the result helped narrow the rock identity | Measures trust and practical value |
| Confidence clarity | Tester understands `High`, `Medium`, or `Low` confidence without extra explanation | Protects against overclaiming |
| Save intent | Tester can save a useful result and reopen it later | Confirms collection value |
| Confusion points | Tester can name any unclear step or misleading copy | Feeds Sprint 9 polish decisions |

## **Definition Of Ready**

- `S8-1` has a clear user-facing outcome.
- Feedback choices are intentionally small: useful / not useful.
- No backend dependency is required for this sprint.
- Existing result and save behavior must not regress.
- The work can start with one failing test.

## **Definition Of Done Checkpoint**

| DoD Criterion | Current State |
| --- | --- |
| Feedback prompt works on result screen | `Yes` |
| Feedback state is typed and covered by test | `Yes` |
| Result save flow still works | `Yes` |
| `pnpm run typecheck` passes | `Yes` |
| Relevant tests pass | `Yes` |
| Manual validation documented | `Yes` |
| MVP version remains in `v0.x.y` | `Yes` |
| No MVP requirement conflicts | `Yes` |

## **Manual QA Plan**

- Run the app on web.
- Complete camera/upload demo path to results.
- Submit `Useful` feedback and confirm thank-you state.
- Repeat with `Not useful`.
- Save a result after feedback and confirm it appears in collection.
- Repeat on iPhone before marking `S8-1` done.

## **Sprint Risks**

- Feedback UI could clutter the result screen if it competes with confidence and save actions.
- A binary feedback choice is intentionally limited; do not expand into full correction workflows yet.
- Local-only feedback is enough for MVP learning, but later analytics may need a storage/event pipeline.

## **Sprint 8 Tracking**

Story status snapshot:

| Story | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `S8-1` | `Done` | [s8-result-feedback.acceptance.test.ts](<../../../__tests__/s8-result-feedback.acceptance.test.ts>), [core-flow.spec.ts](<../../../e2e/core-flow.spec.ts>) | Feedback prompt and thank-you state validated on web and iPhone |
| `S8-2` | `Done` | This sprint plan | Success signals defined and used in QA framing |
| `S8-3` | `Done` | [s8-result-feedback.acceptance.test.ts](<../../../__tests__/s8-result-feedback.acceptance.test.ts>), [result-feedback.ts](<../../../lib/result-feedback.ts>), [result-feedback-context.tsx](<../../../lib/result-feedback-context.tsx>) | Red, green, refactor completed |


Manual QA log (`S8-1`):

- Date: 2026-05-02
- Scope: Result usefulness prompt (`Useful`/`Not useful`) and save flow continuity
- Platforms: Web, iPhone
- Validation: Submitted result feedback and confirmed thank-you state; saved result after feedback and reopened saved detail
- Automated evidence: [s8-result-feedback.acceptance.test.ts](<../../../__tests__/s8-result-feedback.acceptance.test.ts>), [s8-result-feedback-context.test.ts](<../../../__tests__/s8-result-feedback-context.test.ts>), [core-flow.spec.ts](<../../../e2e/core-flow.spec.ts>)

# **Rock ID Agile Delivery Plan**

This document turns the product roadmap into a working agile delivery cycle. It is intentionally lightweight: enough structure to keep development disciplined, without slowing down implementation.

## **Delivery Model**

- Cadence: 1-week sprints during MVP discovery and buildout.
- Sprint goal format: one user-visible outcome per sprint.
- Release strategy: ship vertical slices that can be demoed in the app.
- Backlog owner: product/engineering pair, using the PRD and roadmap as source material.
- Technical quality gate: every sprint should end with typecheck passing and a short demo path verified manually.

## **Agile Workflow**

1. Backlog refinement: break roadmap items into user stories with acceptance criteria.
2. Sprint planning: choose a sprint goal and enough stories to create a demoable slice.
3. Implementation: build one vertical flow at a time, keeping mocks only where an external service is not ready.
4. Review/demo: verify the flow against the screen requirements and record gaps.
5. Retrospective: capture one process improvement and one product learning.
6. Release decision: merge or tag only when the definition of done is met.

## **Definition Of Ready**

A story is ready when:

- It has a clear user value statement.
- Acceptance criteria are testable.
- Required UI states are identified.
- Required data inputs/outputs are known.
- Dependencies are either available or explicitly mocked.
- The story can be completed within one sprint.

## **Definition Of Done**

A story is done when:

- The user-facing flow works in the app.
- Edge states from the story are handled.
- `pnpm run typecheck` passes.
- Manual validation steps are documented in the sprint notes.
- Any new dependency is justified in `package.json` and reflected in `pnpm-lock.yaml`.
- The implementation avoids conflicting with the MVP requirements in [Screen-By-ScreenRequirements.md](<Screen-By-ScreenRequirements.md>).

## **MVP Epics**

| Epic | Outcome | Primary Docs |
| --- | --- | --- |
| `E1: Capture Input` | Users can take or upload a rock photo | Screen requirements, flow map |
| `E2: Image Review` | Users can confirm photo quality before analysis | Wireframes, screen requirements |
| `E3: Observations` | Users can add optional field clues | PRD, screen requirements |
| `E4: Mock Identification` | Users receive top 3 matches with confidence and explanation | PRD, roadmap |
| `E5: Saved Finds` | Users can save and revisit identifications | PRD, screen requirements |
| `E6: Learning Content` | Users can read beginner rock education content | PRD, wireframes |

## **Sprint 1: Real Photo Input**

Sprint goal:
Replace mocked capture/upload with real device image input and pass the selected image through the review flow.

Stories:

| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S1-1` | As a user, I can choose a photo from my library so I can identify an existing rock image. | `Upload Photo` opens the media picker; selected image appears on `Review Photo`; cancellation returns gracefully to Identify. | Must |
| `S1-2` | As a user, I can take a new photo so I can identify a rock in the field. | `Take Photo` requests camera permission; camera opens; captured image appears on `Review Photo`; denied permission shows a useful message. | Must |
| `S1-3` | As a user, I can review the actual selected image before analysis. | Review screen renders the selected image URI; missing image shows a recovery state; `Use Photo` continues to observations. | Must |
| `S1-4` | As the team, we can validate the app after dependency changes. | `expo-image-picker` is installed with pnpm; `pnpm run typecheck` passes; manual capture/upload paths are verified. | Must |

## **Sprint 1 Tracking**

Story status snapshot:

| Story | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `S1-1` | `Done` | [__tests__/s1-gallery-upload.acceptance.test.ts](<../__tests__/s1-gallery-upload.acceptance.test.ts>) pass; upload flow wired in [app/(tabs)/index.tsx](<../app/(tabs)/index.tsx>) and [app/review.tsx](<../app/review.tsx>) | Upload picker opens, selected image reaches review, cancel path handled |
| `S1-2` | `In Progress` | Camera flow implementation is staged as WIP (`git stash` label: `wip/s2-camera-flow`) | `Open Camera` still needs final branch integration and verification on device |
| `S1-3` | `Partial` | [app/review.tsx](<../app/review.tsx>) renders selected image URI and continues to observations | Upload path complete; camera path completion depends on `S1-2` integration |
| `S1-4` | `Partial` | `pnpm run typecheck` passes; image-picker dependency aligned to Expo | Manual capture/upload QA notes still need to be recorded |

Definition of done checkpoint:

| DoD Criterion | Current State |
| --- | --- |
| User-facing flow works in app | `Partial` |
| Edge states handled | `Partial` |
| `pnpm run typecheck` passes | `Yes` |
| Manual validation documented | `No` |
| Dependency changes justified and locked | `Yes` |
| No MVP requirement conflicts | `Yes` |

Tracking update policy:

- Update this table at the end of each sprint demo.
- Link every story status change to either a passing test, a code reference, or a demo note.
- Do not mark `Done` until all DoD criteria are satisfied for that story.

Out of scope for Sprint 1:

- Real image quality scoring.
- Real rock classification API.
- Persistent saved finds.
- Custom live camera overlay.

## **Sprint 2: Result And Session State**

Sprint goal:
Carry the selected image and observation data into a single in-app identification session.

Candidate stories:

- Store selected image URI and optional observations in shared state.
- Show selected image thumbnail on analysis and results screens.
- Replace hardcoded result data with a typed mock analysis service.
- Add low-confidence result variant using mock fixtures.

## **Sprint 3: Saved Finds**

Sprint goal:
Make saved finds persistent enough for repeated local use.

Candidate stories:

- Define saved-find data model.
- Save current mock result with image URI, timestamp, notes, and confidence.
- Replace static collection entries with saved records.
- Add empty, loading, and missing-image states.

## **Sprint 4: MVP Hardening**

Sprint goal:
Prepare the prototype for first field-style testing.

Candidate stories:

- Add basic image quality hints.
- Add analytics event wrapper stubs.
- Add beginner rock content pages for the MVP rock set.
- Run accessibility pass on buttons, image previews, and confidence labels.
- Create a manual QA checklist for MVP demo flow.

## **Backlog Prioritization Rules**

- Prefer vertical slices over isolated infrastructure.
- Do not build backend/model integration before the app can reliably capture, review, and carry image input.
- Keep mocks typed and easy to replace.
- Treat confidence and uncertainty messaging as core product behavior, not polish.
- Defer account sync, expert review, and community workflows until after the local MVP loop works.

## **Current Next Action**

Start Sprint 1 with `S1-1` and `S1-2` together because `expo-image-picker` supports both library selection and camera capture. The implementation should update the Identify, Capture Tips, and Review screens so the first real user input flows through the app.

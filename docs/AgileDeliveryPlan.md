# **Rock ID Agile Delivery Plan**

This document turns the product roadmap into a working agile delivery cycle. It is intentionally lightweight: enough structure to keep development disciplined, without slowing down implementation.

Driver handoff and day-to-day engineering execution standards live in [NextDriverDevGuide.md](<NextDriverDevGuide.md>).

## **Delivery Model**

- Cadence: 1-week sprints during MVP discovery and buildout.
- Sprint goal format: one user-visible outcome per sprint.
- Release strategy: ship vertical slices that can be demoed in the app.
- Versioning strategy: stay in `v0.x.y` during MVP; use Commitizen-shaped history plus `pnpm bump:dry`, `pnpm bump:patch`, or `pnpm bump:minor` for tracked release bumps.
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
- Any version bump is intentional and keeps MVP in the `v0.x.y` line.
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
| `S1-2` | `Done` | Camera flow wired in [app/capture-tips.tsx](<../app/capture-tips.tsx>), [lib/photo-input.ts](<../lib/photo-input.ts>), and [__tests__/photo-input.test.ts](<../__tests__/photo-input.test.ts>) | Permission denied/cancel/captured states covered in unit tests; real-device camera QA completed and working as expected |
| `S1-3` | `Done` | [app/review.tsx](<../app/review.tsx>) renders selected image URI and continues to observations | Review now supports both upload and camera selected-image preview |
| `S1-4` | `Done` | `pnpm run typecheck` passes; image-picker dependency aligned to Expo; test suites passing | Manual capture/upload paths re-verified on a real device and working as expected |

Definition of done checkpoint:

| DoD Criterion | Current State |
| --- | --- |
| User-facing flow works in app | `Yes` |
| Edge states handled | `Yes` |
| `pnpm run typecheck` passes | `Yes` |
| Manual validation documented | `Yes` |
| MVP version remains in `v0.x.y` | `Yes` |
| Dependency changes justified and locked | `Yes` |
| No MVP requirement conflicts | `Yes` |

Tracking update policy:

- Update this table at the end of each sprint demo.
- Link every story status change to either a passing test, a code reference, or a demo note.
- Do not mark `Done` until all DoD criteria are satisfied for that story.

Manual QA log (`Sprint 1`):

- Date: 2026-05-01
- Device/OS: Real iOS device
- Tester: Amir
- `S1-2` camera permission prompt appears: `Pass`
- `S1-2` denied camera permission shows useful message: `Pass`
- `S1-2` captured photo appears on review screen: `Pass`
- `S1-2` cancel camera returns gracefully: `Pass`
- `S1-4` upload path manually re-verified on device: `Pass`
- Notes / follow-up fixes: None

Out of scope for Sprint 1:

- Real image quality scoring.
- Real rock classification API.
- Persistent saved finds.
- Custom live camera overlay.

## **Sprint 2: Result And Session State**

Sprint goal:
Carry the selected image and observation data into a single in-app identification session.

Stories:

| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S2-1` | As a user, my selected rock photo stays attached to the identification session. | Selected image URI is stored in shared session state and survives navigation from review through analysis/results. | Must |
| `S2-2` | As a user, I can see the selected image throughout analysis and results. | Analysis and results screens render the current session photo thumbnail when available. | Must |
| `S2-3` | As the team, we can replace hardcoded results with a typed mock analysis service. | Results screen reads from a typed mock analysis result generated from selected photo and observations. | Must |
| `S2-4` | As a user, I can see a low-confidence result variant when evidence is weak. | Mock analysis can return a low-confidence fixture with uncertainty-focused copy. | Should |

## **Sprint 2 Tracking**

Story status snapshot:

| Story | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `S2-1` | `Done` | [lib/identification-session.ts](<../lib/identification-session.ts>) and [__tests__/s2-session-state.acceptance.test.ts](<../__tests__/s2-session-state.acceptance.test.ts>) | In-memory session carries selected photo and observations |
| `S2-2` | `Done` | [app/analyzing.tsx](<../app/analyzing.tsx>) and [app/results.tsx](<../app/results.tsx>) | Session image thumbnail appears after review |
| `S2-3` | `Done` | [lib/mock-analysis.ts](<../lib/mock-analysis.ts>), [app/results.tsx](<../app/results.tsx>), and [__tests__/s2-mock-analysis.acceptance.test.ts](<../__tests__/s2-mock-analysis.acceptance.test.ts>) | Basalt fixture uses dark, fine-grained, vesicular observations |
| `S2-4` | `Done` | [lib/mock-analysis.ts](<../lib/mock-analysis.ts>) and [__tests__/s2-mock-analysis.acceptance.test.ts](<../__tests__/s2-mock-analysis.acceptance.test.ts>) | Low-confidence fixture returns uncertainty-focused copy when evidence is weak; `pnpm run typecheck` and `pnpm test` pass |

Definition of done checkpoint (`Sprint 2`):

| DoD Criterion | Current State |
| --- | --- |
| User-facing flow works in app | `Yes` - results use the typed mock analysis service |
| Edge states handled | `Yes` - weak evidence returns a low-confidence result |
| `pnpm run typecheck` passes | `Yes` |
| Relevant tests pass | `Yes` - `pnpm test` passes |
| Manual validation documented | `N/A for service-level fixture`; covered by acceptance test |
| MVP version remains in `v0.x.y` | `Yes` |
| Dependency changes justified and locked | `N/A` - no dependency changes |
| No MVP requirement conflicts | `Yes` |

Manual QA log (`Sprint 2`):

- Date: 2026-05-02
- Scope: `S2-4` low-confidence mock analysis fixture
- Validation type: Automated acceptance and typecheck; no manual device-only behavior added
- `pnpm run typecheck`: `Pass`
- `pnpm test`: `Pass`
- Notes / follow-up fixes: None

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

Sprint 2 is complete. Next candidate: start Sprint 3 with the saved-find data model as the first red-green-refactor slice.

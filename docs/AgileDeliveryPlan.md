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

## **Live Kanban**

The live board is maintained in [Kanban.md](<Kanban.md>).

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

<details>
<summary>Sprint 1 details</summary>

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

</details>

## **Sprint 2: Result And Session State**

<details>
<summary>Sprint 2 details</summary>

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

</details>

## **Sprint 3: Saved Finds**

<details>
<summary>Sprint 3 details</summary>

Sprint goal:
Make saved finds persistent enough for repeated local use.

Stories:

| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S3-1` | As the team, we can model a saved find from the current identification result. | A saved-find factory creates a typed record with image URI, timestamp, notes, confidence, top match, and matches from session + analysis data. | Must |
| `S3-2` | As a user, I can save the current mock result so I can revisit it later in the session. | Save action stores the current analysis result with image URI, timestamp, notes, and confidence. | Must |
| `S3-3` | As a user, I can see saved finds in my collection. | Collection screen reads saved records instead of static entries and handles empty state. | Must |
| `S3-4` | As a user, I can recover gracefully when a saved find image is missing. | Saved records render a useful missing-image state without crashing. | Should |

## **Sprint 3 Tracking**

Story status snapshot:

| Story | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `S3-1` | `Done` | [lib/saved-finds.ts](<../lib/saved-finds.ts>) and [__tests__/s3-saved-find-model.test.ts](<../__tests__/s3-saved-find-model.test.ts>) | Saved-find model maps session + analysis into a typed record; matches array is cloned |
| `S3-2` | `Done` | [lib/saved-finds.ts](<../lib/saved-finds.ts>) and [__tests__/s3-saved-find-store.test.ts](<../__tests__/s3-saved-find-store.test.ts>) | In-memory store saves records newest-first and replaces duplicate saves by id |
| `S3-3` | `Done` | [app/(tabs)/collection.tsx](<../app/(tabs)/collection.tsx>), [lib/collection-view-model.ts](<../lib/collection-view-model.ts>), and [__tests__/s3-collection-thumbnail.acceptance.test.ts](<../__tests__/s3-collection-thumbnail.acceptance.test.ts>) | Collection reads saved finds from in-memory store, shows empty state, and renders a thumbnail placeholder when image is missing |
| `S3-4` | `Done` | [app/saved/[id].tsx](<../app/saved/[id].tsx>) and [__tests__/s3-saved-find-detail.acceptance.test.ts](<../__tests__/s3-saved-find-detail.acceptance.test.ts>) | Saved-find details render a missing-image fallback when image URI is absent; unknown ids show a recovery state |

Definition of done checkpoint (`Sprint 3`):

| DoD Criterion | Required Outcome |
| --- | --- |
| User-facing flow works in app | A user can save a result from `Results` and immediately see it in `Collection` |
| Persistence is sufficient for local use | Saved finds are still available after app restart on the same device |
| Edge states handled | Empty collection renders a useful state; missing image URI renders a graceful placeholder |
| Navigation works | Tapping a saved find opens its details route without crashes |
| `pnpm run typecheck` passes | `Pass` |
| Relevant tests pass | `pnpm test` passes; acceptance coverage exists for save + list + open |
| Manual validation documented | On-device QA recorded in this sprint section |
| Dependency changes justified and locked | Any new storage dependency is justified and captured in `pnpm-lock.yaml` |
| No MVP requirement conflicts | Saved finds remain clearly local and mocked results remain labeled as mocked |

Definition of done checkpoint (`S3-1`):

| DoD Criterion | Current State |
| --- | --- |
| User-facing flow works in app | `N/A for model-only slice` - no UI behavior added |
| Edge states handled | `Yes` - saved match list is cloned from analysis data |
| `pnpm run typecheck` passes | `Yes` |
| Relevant tests pass | `Yes` - `pnpm test` passes |
| Manual validation documented | `N/A for model-only slice`; covered by unit test |
| MVP version remains in `v0.x.y` | `Yes` |
| Dependency changes justified and locked | `N/A` - no dependency changes |
| No MVP requirement conflicts | `Yes` |

Manual QA log (`S3-1`):

- Date: 2026-05-02
- Scope: `S3-1` saved-find data model
- Validation type: Automated unit test and typecheck; no manual device-only behavior added
- `pnpm run typecheck`: `Pass`
- `pnpm test`: `Pass`
- Notes / follow-up fixes: None

Definition of done checkpoint (`S3-2`):

| DoD Criterion | Current State |
| --- | --- |
| User-facing flow works in app | `N/A for store-only slice` - UI wiring starts in `S3-3` |
| Edge states handled | `Yes` - duplicate saves replace existing saved finds by id |
| `pnpm run typecheck` passes | `Yes` |
| Relevant tests pass | `Yes` - `pnpm test` passes |
| Manual validation documented | `N/A for store-only slice`; covered by unit test |
| MVP version remains in `v0.x.y` | `Yes` |
| Dependency changes justified and locked | `N/A` - no dependency changes |
| No MVP requirement conflicts | `Yes` |

Manual QA log (`S3-2`):

- Date: 2026-05-02
- Scope: `S3-2` in-memory saved-find store
- Validation type: Automated unit test and typecheck; UI save action not added yet
- `pnpm run typecheck`: `Pass`
- `pnpm test`: `Pass`
- Notes / follow-up fixes:
  - QA: Save Result navigation previously opened a missing saved find ("This saved find could not be loaded") because the button did not persist to the store before routing.
  - QA: Navigation after saving felt broken (hardcoded route id, no saved record).
  - Fix: Wire `Save Result` to write a `SavedFind` into the store and navigate to the saved id; add acceptance coverage for save action.

Definition of done checkpoint (`S3-3`):

| DoD Criterion | Current State |
| --- | --- |
| User-facing flow works in app | `Yes` - collection reads from saved-find store and renders rows |
| Edge states handled | `Yes` - empty state and missing-image placeholder covered |
| `pnpm run typecheck` passes | `Yes` |
| Relevant tests pass | `Yes` - `pnpm test` passes |
| Manual validation documented | `N/A for in-memory list behavior`; covered by acceptance test |
| MVP version remains in `v0.x.y` | `Yes` |
| Dependency changes justified and locked | `N/A` - no dependency changes |
| No MVP requirement conflicts | `Yes` |

Definition of done checkpoint (`S3-4`):

| DoD Criterion | Current State |
| --- | --- |
| User-facing flow works in app | `Yes` - saved-find detail renders a preview fallback when image is missing |
| Edge states handled | `Yes` - unknown id renders a recovery state instead of crashing |
| `pnpm run typecheck` passes | `Yes` |
| Relevant tests pass | `Yes` - `pnpm test` passes |
| Manual validation documented | `N/A for rendering-only behavior`; covered by acceptance test |
| MVP version remains in `v0.x.y` | `Yes` |
| Dependency changes justified and locked | `N/A` - no dependency changes |
| No MVP requirement conflicts | `Yes` |

</details>

## **Sprint 4: MVP Hardening**

<details>
<summary>Sprint 4 details</summary>

Sprint goal:
Prepare the prototype for first field-style testing.

Stories:

| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S4-1` | As a user, I can see basic image quality hints before analysis so I know whether to retake the photo. | Review screen derives `Sharpness`, `Lighting`, and `Framing` labels from available photo metadata; missing photo shows `Unknown` labels; a single actionable tip is shown. | Must |
| `S4-2` | As the team, we can stub analytics event tracking so we can wire product metrics without committing to a vendor. | A small analytics wrapper exists; it is no-op by default and testable via an injected sink; event names align with Screen-By-Screen requirements. | Should |
| `S4-3` | As a user, I can browse beginner rock learning topics so I can build confidence in what the results mean. | Learn tab lists MVP topics and is ready for topic detail routing; baseline `learn_tab_viewed` analytics fires on open. | Should |

## **Sprint 4 Tracking**

Story status snapshot:

| Story | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `S4-1` | `Done` | [app/review.tsx](<../app/review.tsx>), [lib/image-quality.ts](<../lib/image-quality.ts>), and [__tests__/s4-image-quality.test.ts](<../__tests__/s4-image-quality.test.ts>) | Review now shows basic quality hints and a single tip using local metadata only |
| `S4-2` | `Done` | [lib/analytics.ts](<../lib/analytics.ts>), [__tests__/s4-analytics.acceptance.test.ts](<../__tests__/s4-analytics.acceptance.test.ts>), and [app/(tabs)/index.tsx](<../app/(tabs)/index.tsx>) | Analytics wrapper exists and key screens emit baseline events without binding to a vendor |
| `S4-3` | `Done` | [app/(tabs)/learn.tsx](<../app/(tabs)/learn.tsx>), [app/(tabs)/learn/[slug].tsx](<../app/(tabs)/learn/[slug].tsx>), and [__tests__/s4-learn-topics.acceptance.test.ts](<../__tests__/s4-learn-topics.acceptance.test.ts>) | Learn topics now navigate into a placeholder detail screen and emit `learn_topic_opened` analytics |

## **Sprint 4 Retro (Mid-Sprint)**

What went well:

- Following ATDD for most changes kept us focused on user-visible outcomes.

What went wrong / needs improvement:

- Poor unit-level TDD discipline: we sometimes implemented first and tested later.
- Missing the consistent rhythm of test-fail → test-pass (and the narrative in commits).
- Automated QA coverage is not true end-to-end yet; some navigation/UI issues still require manual discovery.

Action items:

- Default to red → green → refactor for each change, even for “small” fixes.
- Prefer unit tests for pure logic (view models, actions, mapping functions) before wiring UI.
- Add a proper E2E smoke path for the core flow (Identify → Review → Observations → Results → Save → Collection → Saved Detail).

</details>

## **Sprint 5: Saved Finds Persistence**

Sprint goal:
Persist saved finds across app restarts on the same device.

Stories:

| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S5-1` | As a user, my saved finds persist across app restarts so I do not lose my collection. | Saved finds are stored locally; after app restart, Collection shows previously saved finds and Saved Find detail opens without "could not be loaded". | Must |
| `S5-2` | As a user, I can delete a saved find so I can keep my collection clean. | Delete action removes a saved find; Collection updates; opening a deleted id shows a recovery state. | Should |

## **Sprint 5 Tracking**

Story status snapshot:

| Story | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `S5-1` | `Done` | [lib/saved-finds-context.tsx](<../lib/saved-finds-context.tsx>), [lib/saved-finds-persistence.ts](<../lib/saved-finds-persistence.ts>), and [__tests__/s5-saved-finds-context-persistence.test.ts](<../__tests__/s5-saved-finds-context-persistence.test.ts>) | On-device restart QA passed on iPhone: after force quit + reopen, `Collection` still shows saved finds and Saved Find detail opens normally |
| `S5-2` | `Done` | [app/saved/[id].tsx](<../app/saved/[id].tsx>), [lib/saved-finds.ts](<../lib/saved-finds.ts>), and [__tests__/s3-saved-find-store.test.ts](<../__tests__/s3-saved-find-store.test.ts>) | Saved Find detail includes a delete action; deletion removes the record, updates Collection, and opening a deleted id shows the recovery state |

Manual QA log (`Sprint 5`):

- Date: 2026-05-02
- Scope: `S5-1` saved finds persistence across app restart
- Device/OS: iPhone (iOS)
- Tester: Amir
- Steps: Save a result → force quit app → reopen → confirm `Collection` still shows saved find → open saved find detail
- Result: Pass
- Notes / follow-up fixes: None

## **Sprint 5 Retro (Quick)**

What went well:

- Kept the red → green rhythm and commit narrative (failing test → test-pass → refactor).

What to improve:

- Acceptance-test commits used `test:` which meant release bump tooling didn’t “see” early feature work.

Action:

- For ATDD acceptance tests tied to user-visible stories, use `feat:` commit type going forward (keep 🧪 emoji if it’s primarily test code).

## **Sprint 6: Home Recent Finds**

Sprint goal:
Make the Home tab reflect the user's real saved finds instead of static mock data.

Stories:

| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S6-1` | As a returning user, I can see my most recent saved finds on Home so I can quickly reopen recent rocks. | Home reads saved finds from the saved-find store, shows an empty state when none exist, limits populated results to the 3 most recent, and links each item to Saved Find detail. | Must |
| `S6-2` | As a user, I see stable Recent Finds ordering when saved times match. | Recent Finds breaks equal `savedAt` ties deterministically by title so rendering does not depend on input order. | Should |

## **Sprint 6 Tracking**

Story status snapshot:

| Story | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `S6-1` | `Done` | [app/(tabs)/index.tsx](<../app/(tabs)/index.tsx>), [lib/identify-view-model.ts](<../lib/identify-view-model.ts>), [__tests__/s6-recent-finds.acceptance.test.ts](<../__tests__/s6-recent-finds.acceptance.test.ts>), and [e2e/core-flow.spec.ts](<../e2e/core-flow.spec.ts>) | Home reads saved finds from the saved-find context, shows empty state, limits to 3 newest, and links to saved details |
| `S6-2` | `Done` | [lib/identify-view-model.ts](<../lib/identify-view-model.ts>) and [__tests__/s6-recent-finds.acceptance.test.ts](<../__tests__/s6-recent-finds.acceptance.test.ts>) | Equal `savedAt` timestamps sort by title for deterministic Recent Finds order |

Definition of done checkpoint (`Sprint 6`):

| DoD Criterion | Current State |
| --- | --- |
| User-facing flow works in app | `Ready for manual QA` - Home Recent Finds now uses saved-find state |
| Edge states handled | `Yes` - empty state, 3-item limit, and tied timestamp ordering covered |
| `pnpm run typecheck` passes | `Yes` |
| Relevant tests pass | `Yes` - `pnpm test` passes |
| Manual validation documented | `Pending` - quick Home Recent Finds device QA still needed before merge |
| MVP version remains in `v0.x.y` | `Yes` |
| Dependency changes justified and locked | `N/A` - no dependency changes in S6 |
| No MVP requirement conflicts | `Yes` |

Manual QA log (`Sprint 6`):

- Date: 2026-05-02
- Scope: Home Recent Finds uses real saved finds
- Validation type: Pending manual device QA
- `pnpm run typecheck`: `Pass`
- `pnpm test`: `Pass`
- Notes / follow-up fixes: Confirm on device that saving a result updates Home Recent Finds and tapping a recent find opens Saved Find detail.

## **Backlog Prioritization Rules**

- Prefer vertical slices over isolated infrastructure.
- Do not build backend/model integration before the app can reliably capture, review, and carry image input.
- Keep mocks typed and easy to replace.
- Treat confidence and uncertainty messaging as core product behavior, not polish.
- Defer account sync, expert review, and community workflows until after the local MVP loop works.

## **Current Next Action**

Manual QA Sprint 6 Home Recent Finds on device, then merge `feat/s6-recent-finds` to `main` if the flow passes.

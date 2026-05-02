# **Sprint 3: Saved Finds**

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
| `S3-1` | `Done` | [lib/saved-finds.ts](<../../../lib/saved-finds.ts>) and [__tests__/s3-saved-find-model.test.ts](<../../../__tests__/s3-saved-find-model.test.ts>) | Saved-find model maps session + analysis into a typed record; matches array is cloned |
| `S3-2` | `Done` | [lib/saved-finds.ts](<../../../lib/saved-finds.ts>) and [__tests__/s3-saved-find-store.test.ts](<../../../__tests__/s3-saved-find-store.test.ts>) | In-memory store saves records newest-first and replaces duplicate saves by id |
| `S3-3` | `Done` | [app/(tabs)/collection.tsx](<../../../app/(tabs)/collection.tsx>), [lib/collection-view-model.ts](<../../../lib/collection-view-model.ts>), and [__tests__/s3-collection-thumbnail.acceptance.test.ts](<../../../__tests__/s3-collection-thumbnail.acceptance.test.ts>) | Collection reads saved finds from in-memory store, shows empty state, and renders a thumbnail placeholder when image is missing |
| `S3-4` | `Done` | [app/saved/[id].tsx](<../../../app/saved/[id].tsx>) and [__tests__/s3-saved-find-detail.acceptance.test.ts](<../../../__tests__/s3-saved-find-detail.acceptance.test.ts>) | Saved-find details render a missing-image fallback when image URI is absent; unknown ids show a recovery state |

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


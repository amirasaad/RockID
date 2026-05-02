# **Sprint 1: Real Photo Input**

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
| `S1-1` | `Done` | [__tests__/s1-gallery-upload.acceptance.test.ts](<../../../__tests__/s1-gallery-upload.acceptance.test.ts>) pass; upload flow wired in [app/(tabs)/index.tsx](<../../../app/(tabs)/index.tsx>) and [app/review.tsx](<../../../app/review.tsx>) | Upload picker opens, selected image reaches review, cancel path handled |
| `S1-2` | `Done` | Camera flow wired in [app/capture-tips.tsx](<../../../app/capture-tips.tsx>), [lib/photo-input.ts](<../../../lib/photo-input.ts>), and [__tests__/photo-input.test.ts](<../../../__tests__/photo-input.test.ts>) | Permission denied/cancel/captured states covered in unit tests; real-device camera QA completed and working as expected |
| `S1-3` | `Done` | [app/review.tsx](<../../../app/review.tsx>) renders selected image URI and continues to observations | Review now supports both upload and camera selected-image preview |
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


# **Sprint 17: Saved Photos + Navigation + Settings**

Sprint goal:
Make saved finds durable (photo persists in app storage) and improve navigation after saving.

Planning date:
2026-05-05

## **Sprint Stories**

| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S17-1` | As a user, saved finds keep their photos available later. | Saving a result compresses + copies the photo into app storage (when enabled) and saved thumbnails render after relaunch. | Must |
| `S17-2` | As a user, saved find detail has clear next navigation actions. | Saved Find screen includes “Re-analyze”, “Back to Collection”, and “Identify Another”. | Must |
| `S17-3` | As a user, Settings controls whether photos are stored locally. | Settings exposes a “Save Photos Locally” toggle and saving respects it. | Must |

## **Definition Of Done Checkpoint**

| DoD Criterion | Target State |
| --- | --- |
| Local photo persistence works on iOS/Android | `Yes` |
| Saved navigation CTAs exist | `Yes` |
| Settings toggle exists and is persisted | `Yes` |
| `pnpm run typecheck` passes | `Yes` |
| Unit + e2e tests pass | `Yes` |

## **Sprint 17 Tracking**

| Story | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `S17-1` | `Done` | [saved-photo-storage.ts](<../../../lib/saved-photo-storage.ts>), [saved-finds-actions.ts](<../../../lib/saved-finds-actions.ts>), [results.tsx](<../../../app/results.tsx>) | Uses `expo-image-manipulator` and `expo-file-system` new API. |
| `S17-2` | `Done` | [saved/[id].tsx](<../../../app/saved/[id].tsx>) | Adds “Re-analyze” (routes to review), plus clear exits. |
| `S17-3` | `Done` | [app-settings-context.tsx](<../../../lib/app-settings-context.tsx>), [settings.tsx](<../../../app/(tabs)/settings.tsx>) | Toggle persists via AsyncStorage when available. |


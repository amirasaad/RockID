# **Sprint 21: MVP Usability Polish**

Sprint goal:
Polish the MVP flows so key screens are easier to scan, search, and recover from empty states without adding new domain scope.

Planning date:
2026-05-05

## **Why This Sprint Exists**

Rock ID now has the core MVP loop: identify → review results → save finds → revisit via Collection. The next step is usability polish: reduce friction in everyday navigation and make common UI states (searching, filtering, and “no results”) feel intentional and recoverable.

## **Sprint Stories**

| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S21-1` | As a user, I can scan Collection items faster without opening each saved find. | Collection list shows the saved find’s top match name plus a readable category/group hint in the list row. | Must |
| `S21-2` | As a user, search and filters feel controllable and easy to reset. | Collection search supports one-tap clear and there is a single reset action that returns to `query=""` + `filter="All"`. | Must |
| `S21-3` | As a user, empty states tell me what to do next. | Empty states distinguish between “no saved finds yet” vs “no results for current search/filter” and provide a clear recovery action. | Should |

## **Definition Of Done Checkpoint**

| DoD Criterion | Target State |
| --- | --- |
| Collection scanability improvements are user-visible and consistent | `Yes` |
| Search/filter reset path works and is documented | `Yes` |
| Empty states have clear next steps | `Yes` |
| `pnpm run typecheck` passes | `Yes` |
| Relevant tests pass | `Yes` |

## **Sprint 21 Tracking**

| Story | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `S21-1` | `Done` | [collection.tsx](<../../../app/(tabs)/collection.tsx>), [collection-view-model.ts](<../../../lib/collection-view-model.ts>), [s19-collection-search-filter.test.ts](<../../../__tests__/s19-collection-search-filter.test.ts>) | Collection list rows show a readable category hint |
| `S21-2` | `Done` | [collection.tsx](<../../../app/(tabs)/collection.tsx>) | Clear search is one tap; reset returns to `query=""` + `filter="All"` |
| `S21-3` | `Planned` | This sprint plan | Empty states feel like guided UX, not a dead end |

## **Manual QA Notes**

- Verify Collection with multiple saved finds across rock groups.
- Confirm list rows are scannable at a glance and still readable on small screens.
- Search, apply chips, then reset to defaults and confirm the full list returns.
- Validate both empty states: no saved finds vs no results for search/filter.

## **Next Technical Move**

- Create a fresh `sprint/21-mvp-usability-polish` branch from `main`.
- Implement stories on short-lived story branches, then fast-forward the sprint branch into `main` at DoD.

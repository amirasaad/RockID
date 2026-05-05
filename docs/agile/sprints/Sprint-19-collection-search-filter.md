# **Sprint 19: Collection Search And Filters**

Sprint goal:
Make saved finds easier to revisit by adding local search and quick filters to Collection.

Planning date:
2026-05-05

## **Why This Sprint Exists**

The MVP loop has durable saved finds, but a growing field collection becomes hard to scan quickly. Sprint 19 improves the revisit loop with lightweight search and chip filters while keeping the data local-first.

## **Sprint Stories**

| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S19-1` | As a user, I can search saved finds by title, rock name, or category. | Collection search filters saved finds by title, top match name, and top match category; no-match state is clear. | Must |
| `S19-2` | As a user, I can filter saved finds by broad rock group. | Chips support `All`, `Igneous`, `Sedimentary`, `Metamorphic`, and `Low confidence`. | Must |
| `S19-3` | As the team, we can track collection search usage locally. | Search/filter interactions emit `collection_search_used` with query length and filter metadata. | Should |

## **Sprint 19 Tracking**

| Story | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `S19-1` | `Done` | [s19-collection-search-filter.test.ts](<../../../__tests__/s19-collection-search-filter.test.ts>), [collection-view-model.ts](<../../../lib/collection-view-model.ts>) | Query searches title, top match name, and category |
| `S19-2` | `Done` | [collection.tsx](<../../../app/(tabs)/collection.tsx>) | Collection exposes search input plus group/filter chips |
| `S19-3` | `Done` | [collection.tsx](<../../../app/(tabs)/collection.tsx>) | Search/filter use emits `collection_search_used` |

## **Definition Of Done Checkpoint**

| DoD Criterion | Current State |
| --- | --- |
| Collection search filters saved finds | `Yes` |
| Collection chips filter by group/confidence | `Yes` |
| Empty-search state is clear | `Yes` |
| Relevant unit tests exist | `Yes` |
| Main contains the sprint work | `Yes` |
| Release bump/tag completed | `Ready for v0.22.0 bump` |

## **Manual QA Notes**

- Verify Collection with at least three saved finds from different rock groups.
- Search by a title fragment, rock name, and category.
- Tap each chip and confirm the list narrows without losing saved-find navigation.
- Confirm no-match copy says to try another search or filter.
- Release gate completed on 2026-05-05:
  - `pnpm run typecheck` passed
  - `pnpm test` passed: 48 files, 97 tests
  - `pnpm test:e2e` passed: 4 Playwright tests

## **Next Technical Move**

- Release Sprint 19 as `v0.22.0`.
- Then plan Sprint 20 from the current product priority instead of leaving Collection polish in backlog.

# **Sprint 6: Home Recent Finds**

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
| `S6-1` | `Done` | [app/(tabs)/index.tsx](<../../../app/(tabs)/index.tsx>), [lib/identify-view-model.ts](<../../../lib/identify-view-model.ts>), [__tests__/s6-recent-finds.acceptance.test.ts](<../../../__tests__/s6-recent-finds.acceptance.test.ts>), and [e2e/core-flow.spec.ts](<../../../e2e/core-flow.spec.ts>) | Home reads saved finds from the saved-find context, shows empty state, limits to 3 newest, and links to saved details |
| `S6-2` | `Done` | [lib/identify-view-model.ts](<../../../lib/identify-view-model.ts>) and [__tests__/s6-recent-finds.acceptance.test.ts](<../../../__tests__/s6-recent-finds.acceptance.test.ts>) | Equal `savedAt` timestamps sort by title for deterministic Recent Finds order |

Definition of done checkpoint (`Sprint 6`):

| DoD Criterion | Current State |
| --- | --- |
| User-facing flow works in app | `Yes` - Home Recent Finds validated on web and iPhone |
| Edge states handled | `Yes` - empty state, 3-item limit, and tied timestamp ordering covered |
| `pnpm run typecheck` passes | `Yes` |
| Relevant tests pass | `Yes` - `pnpm test` passes |
| Manual validation documented | `Yes` - web and iPhone QA recorded |
| MVP version remains in `v0.x.y` | `Yes` |
| Dependency changes justified and locked | `N/A` - no dependency changes in S6 |
| No MVP requirement conflicts | `Yes` |

Manual QA log (`Sprint 6`):

- Date: 2026-05-02
- Scope: Home Recent Finds uses real saved finds
- Validation type: Manual web and iPhone QA
- Device/Platform: Web and iPhone
- Tester: Amir
- Home Recent Finds updates after saving a result: `Pass`
- Tapping a recent find opens Saved Find detail: `Pass`
- `pnpm run typecheck`: `Pass`
- `pnpm test`: `Pass`
- Notes / follow-up fixes: None

# **Sprint 2: Result And Session State**

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
| `S2-1` | `Done` | [lib/identification-session.ts](<../../../lib/identification-session.ts>) and [__tests__/s2-session-state.acceptance.test.ts](<../../../__tests__/s2-session-state.acceptance.test.ts>) | In-memory session carries selected photo and observations |
| `S2-2` | `Done` | [app/analyzing.tsx](<../../../app/analyzing.tsx>) and [app/results.tsx](<../../../app/results.tsx>) | Session image thumbnail appears after review |
| `S2-3` | `Done` | [lib/mock-analysis.ts](<../../../lib/mock-analysis.ts>), [app/results.tsx](<../../../app/results.tsx>), and [__tests__/s2-mock-analysis.acceptance.test.ts](<../../../__tests__/s2-mock-analysis.acceptance.test.ts>) | Basalt fixture uses dark, fine-grained, vesicular observations |
| `S2-4` | `Done` | [lib/mock-analysis.ts](<../../../lib/mock-analysis.ts>) and [__tests__/s2-mock-analysis.acceptance.test.ts](<../../../__tests__/s2-mock-analysis.acceptance.test.ts>) | Low-confidence fixture returns uncertainty-focused copy when evidence is weak; `pnpm run typecheck` and `pnpm test` pass |

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


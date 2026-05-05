# **Sprint 20: Release Hygiene + Sprint 19 Closeout**

Sprint goal:
Turn Sprint 19 collection search/filter into a clean release candidate while deferring unrelated Android/native artifacts.

Planning date:
2026-05-05

## **Sprint Stories**

| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S20-1` | As the team, we preserve unrelated native artifacts without adopting them. | Android/native artifact state is recorded in ignored `.trae`; artifacts are stashed/deferred and not included in release. | Must |
| `S20-2` | As the team, Sprint 19 has a complete release gate. | Typecheck, full Vitest, and Playwright e2e pass; QA evidence is recorded. | Must |
| `S20-3` | As the team, Sprint 19 is released as an MVP minor version. | Bump to `v0.22.0` with package/app versions aligned. | Must |

## **Sprint 20 Tracking**

| Story | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `S20-1` | `Done` | `.trae/s20-native-artifacts.md` | Android/native artifacts are deferred and stashed as `wip/s20-defer-android-native-artifacts` |
| `S20-2` | `Done` | This sprint file | `pnpm run typecheck`, `pnpm test`, and `pnpm test:e2e` passed on 2026-05-05 |
| `S20-3` | `Done` | `v0.22.0` tag | Released Sprint 19 collection search/filter as MVP minor version |

## **Release Gate Evidence**

| Check | Result |
| --- | --- |
| `pnpm run typecheck` | `Passed` |
| `pnpm test` | `Passed`: 48 files, 97 tests |
| `pnpm test:e2e` | `Passed`: 4 Playwright tests |

## **Manual QA Notes**

- Collection search/filter release gate is green on web e2e.
- Android/native artifacts are intentionally deferred unless they block a later Android sprint.

## **Next Technical Move**

- Merge `sprint/20-release-hygiene` to `main` via fast-forward.
- Execute Sprint 21 MVP usability polish using [Sprint-21](<Sprint-21-mvp-usability-polish.md>) as the sprint source of truth.

# **Sprint 22: Process + Android + Detection Prep**

Sprint goal:
Make the delivery workflow easier to trust by formalizing RockID commit rhythm, starting Android dev-build readiness, and preparing the next rock-detection algorithm sprint with clear eval gates.

Planning date:
2026-05-05

## **Why This Sprint Exists**

Sprint 19-21 shipped useful MVP polish through `v0.23.0`, but the retro exposed three process gaps: no hosted CD yet, inconsistent commit emoji/type history, and deferred Android build configuration. Sprint 22 closes those gaps before returning to heavier rock-identification algorithm work.

## **Sprint Stories**

| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S22-1` | As the team, commit history shows the RockID red-green-refactor rhythm. | Commitizen prompt, commitlint, validator, and docs support `test-fail`, `agile`, `bump`, `qa`, `spike`, and `config`. | Must |
| `S22-2` | As the team, Android build setup is reproducible. | Android package config is adopted intentionally; `pnpm android` path and blockers are documented. | Must |
| `S22-3` | As the team, local release/CD workflow is explicit. | Release checklist covers typecheck, unit/full tests, e2e, bump dry-run, Android smoke, and QA evidence. | Should |
| `S22-4` | As the team, rock-detection algorithm work is eval-gated. | Sprint 23 is planned around non-rock, ambiguous samples, confidence calibration, and analyzer default safety. | Must |

## **Commit Rhythm**

| Type | Emoji | Use |
| --- | --- | --- |
| `test-fail` | `🧪` | Red ATDD/TDD commit that intentionally adds a failing test |
| `feat` | `✨` | User-facing feature implementation when intentionally release-notable |
| `test` | `🧪` | Passing or maintenance test changes |
| `refactor` | `📦` | Code refactor |
| `agile` | `📋` | Sprint docs, Kanban, DoD evidence, retro notes |
| `qa` | `✅` | Manual QA evidence, smoke validation, device-test notes |
| `bump` | `🔖` | Version, changelog, or release bump commit |

## **Definition Of Done Checkpoint**

| DoD Criterion | Target State |
| --- | --- |
| Commit validator enforces type/emoji pairing | `Yes` |
| Commitizen prompt exposes RockID rhythm types | `Yes` |
| Commitlint accepts hyphenated/custom rhythm types | `Yes` |
| Android package config is explicit | `Yes: com.anonymous.rockid` |
| Local release/CD checklist is documented | `Yes` |
| Sprint 23 detection quality gates are planned | `Yes` |
| `pnpm run typecheck` passes | `Yes` |
| `pnpm test` passes | `Yes: 49 files / 112 tests` |
| `pnpm test:e2e` passes | `Yes: 4 Playwright specs` |

## **Sprint 22 Tracking**

| Story | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `S22-1` | `Done` | [s22-commit-rhythm.test.ts](<../../../__tests__/s22-commit-rhythm.test.ts>), [verify-commit-msg.mjs](<../../../scripts/verify-commit-msg.mjs>), [rockid-commitizen.cjs](<../../../scripts/rockid-commitizen.cjs>) | Commit rhythm supported by tests, validator, commitlint, and Commitizen prompt |
| `S22-2` | `Partial` | [app.json](<../../../app.json>) | Android package config adopted; `expo config` confirms package. `adb devices` runs but reports no attached devices/emulators, so `pnpm android` smoke remains pending to avoid generating native artifacts without a target. |
| `S22-3` | `Done` | This sprint file | Local release/CD remains checklist-based, not hosted CD; `pnpm bump:dry` completed for `v0.23.1` preview |
| `S22-4` | `Done` | [Sprint-23](<Sprint-23-detection-quality-gates.md>) | Detection quality work queued behind eval gates |

## **Local Release/CD Checklist**

- Run `pnpm run typecheck`.
- Run `pnpm test`.
- Run `pnpm test:e2e`.
- Run `pnpm bump:dry` before any release bump.
- Validate Android dev-build path with `pnpm android`, or record the exact blocker.
- Record web/iPhone/Android smoke evidence with `✅ qa(s22): ...` when manual QA is complete.
- Use `🔖 bump(release): v0.x.y` for the release commit after the bump command; `commit-and-tag-version` is configured to generate that format.

## **Manual QA Notes**

- Android smoke is required only when local Android tooling is available.
- Android status: `adb devices` works with permissions but currently reports no attached devices/emulators; `pnpm android` smoke is pending until a target device/emulator is available.
- Web e2e smoke passed through Playwright; iPhone/manual Android smoke should be recorded with `✅ qa(...)` when performed.

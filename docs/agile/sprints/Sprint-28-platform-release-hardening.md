# **Sprint 28: Platform Release Hardening**

Sprint goal:
Make release readiness boring by proving iOS and Android build stability before the next version bump.

Planning date:
2026-05-06

## **Why This Sprint Exists**

Sprint 27 enabled the real engine by default and exposed a stronger release rule: the app is not releasable until both iOS and Android build successfully. Android also surfaced Java and Metro/pnpm blockers that now need to become permanent release hygiene instead of one-off fixes.

## **Epic Alignment**

| Epic | Milestone | Sprint Contribution |
| --- | --- | --- |
| `E7: Platform Readiness` | Local iOS/Android dev-build lane is reproducible | Verify native builds and document blockers/fixes. |
| `E12: Release Stability` | No release without iOS + Android build success | Make `verify:release-builds` the release gate and capture evidence. |

## **Sprint Stories**

| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S28-1` | As the team, release builds are gated by both platforms. | `pnpm run verify:release-builds` is documented and must run before any bump. | Must |
| `S28-2` | As the team, Android build setup is stable under pnpm. | JDK 17 runner, Metro resolver, and direct dependency notes are documented; `bundle:android` passes. | Must |
| `S28-3` | As the team, iOS build status is explicit. | iOS bundle export and native build result are recorded; blockers are logged if native build cannot complete. | Must |
| `S28-4` | As a driver, release evidence is easy to hand off. | Sprint doc records exact commands, status, and next remediation step. | Should |

## **Quality Gates**

| Gate | Required Evidence |
| --- | --- |
| Static quality | `pnpm run typecheck` |
| Unit/acceptance coverage | `pnpm test` |
| Browser smoke | `pnpm test:e2e` when core flow changes |
| iOS bundle | `pnpm run bundle:ios` |
| Android bundle | `pnpm run bundle:android` |
| iOS native build | `pnpm run build:ios` or exact blocker |
| Android native build | `pnpm run build:android` or exact blocker |
| Full release gate | `pnpm run verify:release-builds` before release bump |

## **Tracking**

| Story | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `S28-1` | `Ready` | [NextDriverDevGuide.md](<../../NextDriverDevGuide.md>), [AgileDeliveryPlan.md](<../../AgileDeliveryPlan.md>) | Release gate has been introduced; full gate still needs one recorded pass. |
| `S28-2` | `Ready` | [AndroidDevBuild.md](<../../AndroidDevBuild.md>), [run-android-with-jdk.mjs](<../../../scripts/run-android-with-jdk.mjs>), [metro.config.js](<../../../metro.config.js>) | Android bundle passes; native build succeeded after JDK 17 before Metro fix. |
| `S28-3` | `Ready` | iOS build notes | iOS bundle passes; native build still needs recorded release-gate result. |
| `S28-4` | `Ready` | This sprint file | Fill DoD evidence as commands run. |

## **Definition Of Done**

- `pnpm run verify:release-builds` passes, or every platform blocker is documented with a next action.
- No release bump is made unless the full gate passes.
- Android/iOS build notes are updated with any newly discovered blocker.
- Kanban and Epic Milestones reflect platform release health.

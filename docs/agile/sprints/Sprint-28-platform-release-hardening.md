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
| `S28-1` | `Review` | [NextDriverDevGuide.md](<../../NextDriverDevGuide.md>), [AgileDeliveryPlan.md](<../../AgileDeliveryPlan.md>) | Release gate is documented; individual iOS/Android build commands are now green. |
| `S28-2` | `Review` | [AndroidDevBuild.md](<../../AndroidDevBuild.md>), [run-android-with-jdk.mjs](<../../../scripts/run-android-with-jdk.mjs>), [metro.config.js](<../../../metro.config.js>) | `bundle:android` passes; `build:android` passes after verified JDK 17 selection even when global Java is 25. |
| `S28-3` | `Review` | iOS build notes below | `bundle:ios` passes; `build:ios` passes on iPhone 16e simulator with one SDWebImage deployment-version warning. |
| `S28-4` | `Review` | This sprint file | Evidence is captured below; full aggregate gate can run before the next bump. |


## **Build Evidence**

| Command | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `pnpm run bundle:ios` | `Pass` | Exported iOS bundle to a temporary release-gate output directory. | JS bundle and assets generated successfully. |
| `pnpm run build:ios` | `Pass` | Built, installed, and opened on iPhone 16e simulator. | Warning only: `Pods/SDWebImage-SDWebImage` iOS deployment version mismatch. |
| `pnpm run bundle:android` | `Pass` | Exported Android bundle to a temporary release-gate output directory. | JS bundle and assets generated successfully. |
| `pnpm run build:android` | `Pass` | Built debug APK, installed, and opened on Pixel_10_Pro_XL emulator. | Wrapper now selects verified JDK 17 even when global `JAVA_HOME` points at Java 25. |
| `node --check scripts/run-android-with-jdk.mjs` | `Pass` | Syntax check passed. | Guards wrapper edits. |
| `JAVA_HOME=<java-25-home> node scripts/run-android-with-jdk.mjs --help` | `Pass` | Expo Android help displayed. | Regression check for Java 25 global environment. |

## **Open Follow-Up**

- Run the aggregate `pnpm run verify:release-builds` once before the next release bump to prove the complete gate in one command.
- Keep watching the iOS SDWebImage deployment-version warning; it is not blocking the current debug build.

## **Definition Of Done**

- `pnpm run verify:release-builds` passes, or every platform blocker is documented with a next action.
- No release bump is made unless the full gate passes.
- Android/iOS build notes are updated with any newly discovered blocker.
- Kanban and Epic Milestones reflect platform release health.

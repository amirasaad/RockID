# **Sprint 15: App Integration (Feature Flag + Real Engine Output)**

Sprint goal:
Wire the on-device CLIP kNN analyzer behind a feature flag while preserving the existing UX (Results, saving, feedback, and low-confidence clarity), with safe fallback behavior.

Planning date:
2026-05-03

## **Why This Sprint Exists**

We want the app to support a real engine without destabilizing the user experience. Integration should be incremental: a feature flag chooses `mock` vs `onDeviceClipKnn`, and quality gates (eval metrics) decide when the real engine becomes the default.

## **Sprint Stories**

| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S15-1` | As the app, the analyzer can be switched between mock and on-device CLIP kNN. | A feature flag selects analyzer implementation; the UI continues consuming the existing contract (`matches`, `topMatch`, `reasoning`, `nextCheck`). | Must |
| `S15-2` | As a user, the core flow remains stable with the real engine enabled. | Capture/upload → review → results → feedback → save works with real engine output; existing e2e remains stable or is updated intentionally. | Must |
| `S15-3` | As a user, low-confidence and non-rock behavior preserves trust. | Weak evidence returns `Low` confidence with actionable guidance; non-rock cases do not produce high-confidence natural-rock claims. | Must |
| `S15-4` | As the team, the eval loop is the gate for enabling the real engine by default. | Real engine is not enabled by default until it meets the agreed eval gates (especially non-rock false positives). | Must |

## **Definition Of Done Checkpoint**

| DoD Criterion | Target State |
| --- | --- |
| Feature flag exists for analyzer selection | `Yes` |
| Core flow works with real engine | `Yes` |
| Low-confidence behavior remains consistent with Results clarity | `Yes` |
| Non-rock trust behavior is conservative | `Yes` |
| Eval gates are referenced and used for default decision | `Yes` |
| `pnpm run typecheck` passes | `Yes` |
| Unit + e2e tests pass | `Yes` |

## **Sprint Risks**

- Regression risk: wiring a new analyzer can break assumptions about match ordering/fields; keep adapter strict and tested.
- Confidence calibration: early thresholds may overclaim; bias toward `Low/Medium` until dataset + eval support `High`.
- Fallback behavior: ensure failures don’t silently degrade trust (e.g., avoid showing mock in production without disclosure).

## **Sprint 15 Tracking**

| Story | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `S15-1` | `Done` | [configured-analysis.ts](<../../../lib/configured-analysis.ts>), [analyzer-kind.ts](<../../../lib/analyzer-kind.ts>), [on-device-clip-knn-analysis.ts](<../../../lib/on-device-clip-knn-analysis.ts>), [s15-analyzer-flag.test.ts](<../../../__tests__/s15-analyzer-flag.test.ts>) | Set `EXPO_PUBLIC_ROCKID_ANALYZER_KIND=onDeviceClipKnn` (or `globalThis.__ROCKID_ANALYZER_KIND__`) to enable; default remains `mock` until eval gates are met |
| `S15-2` | `Done` | [core-flow-real-engine.spec.ts](<../../../e2e/core-flow-real-engine.spec.ts>) | Core flow works with the real engine enabled |
| `S15-3` | `Done` | [clip-knn.ts](<../../../lib/clip-knn.ts>), [s13-clip-knn-retrieval.acceptance.test.ts](<../../../__tests__/s13-clip-knn-retrieval.acceptance.test.ts>), [on-device-clip-knn-analysis.ts](<../../../lib/on-device-clip-knn-analysis.ts>) | Retrieval confidence is conservative when non-rock is plausible; low-confidence messaging remains actionable |
| `S15-4` | `Done` | [Sprint-11-rock-id-reality-check.md](<Sprint-11-rock-id-reality-check.md>), [s11-rock-id-eval.acceptance.test.ts](<../../../__tests__/s11-rock-id-eval.acceptance.test.ts>), [analyzer-kind.ts](<../../../lib/analyzer-kind.ts>) | Default stays `mock`; flip the default only after eval gates pass (especially non-rock false positives) |

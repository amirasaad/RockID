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
| `S15-1` | `Planned` | This sprint plan | Flag controls analyzer selection |
| `S15-2` | `Planned` | This sprint plan | E2E stability required |
| `S15-3` | `Planned` | This sprint plan | Trust-first behavior |
| `S15-4` | `Planned` | This sprint plan | Eval is the gate |


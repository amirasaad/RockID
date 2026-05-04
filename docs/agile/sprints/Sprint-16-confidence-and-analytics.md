# **Sprint 16: Confidence Thresholds + Analytics Decision**

Sprint goal:
Make confidence banding conservative-by-default and testable, and establish a local-first analytics policy (no backend required).

Planning date:
2026-05-05

## **Why This Sprint Exists**

We need predictable, trust-preserving confidence thresholds for kNN retrieval and a clear policy for how “feedback/analytics” is handled before any backend exists.

## **Sprint Stories**

| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S16-1` | As the engine, confidence thresholds are explicit and conservative. | Confidence thresholds live in a dedicated module, are used by kNN retrieval, and are covered by tests. | Must |
| `S16-2` | As the team, analytics remain local-first until a backend exists. | A local event log can be enabled behind a dev flag; `track()` remains a no-op by default. | Must |

## **Definition Of Done Checkpoint**

| DoD Criterion | Target State |
| --- | --- |
| Conservative confidence thresholds are implemented | `Yes` |
| Local-first analytics decision is encoded | `Yes` |
| `pnpm run typecheck` passes | `Yes` |
| Unit + e2e tests pass | `Yes` |

## **Sprint 16 Tracking**

| Story | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `S16-1` | `Done` | [confidence-thresholds.ts](<../../../lib/confidence-thresholds.ts>), [clip-knn.ts](<../../../lib/clip-knn.ts>) | Thresholds are conservative by default; non-rock plausibility prevents `High` confidence. |
| `S16-2` | `Done` | [analytics-log.ts](<../../../lib/analytics-log.ts>), [analytics-log-persistence.ts](<../../../lib/analytics-log-persistence.ts>), [analytics-log-bootstrap.ts](<../../../lib/analytics-log-bootstrap.ts>), [s16-analytics-log.test.ts](<../../../__tests__/s16-analytics-log.test.ts>) | Enable with `EXPO_PUBLIC_ROCKID_ENABLE_ANALYTICS_LOG=1`. Default stays local/no-op (no backend). |


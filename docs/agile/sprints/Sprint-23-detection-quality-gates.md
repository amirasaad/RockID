# **Sprint 23: Detection Quality Gates**

Sprint goal:
Improve RockID identification quality through measurable eval gates before changing the default analyzer.

Planning date:
2026-05-05

## **Why This Sprint Exists**

The core product promise is still rock identification. Sprint 23 returns to the algorithmic "magic part" after Sprint 22 hardens the process and Android build lane. The work should be eval-first: improve evidence, measure non-rock safety, and only then consider default analyzer changes.

## **Sprint Stories**

| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S23-1` | As the team, we can see current analyzer quality against harder fixtures. | Eval report includes current `mock` and `onDeviceClipKnn` behavior for common rocks, non-rock look-alikes, and ambiguous samples. | Must |
| `S23-2` | As a user, non-rock look-alikes are not overclaimed as natural rocks. | Non-rock false positives are tracked and high-confidence natural-rock answers are blocked for non-rock-dominated results. | Must |
| `S23-3` | As a user, ambiguous photos receive conservative confidence. | Ambiguous/weak inputs return `Low` confidence with next-step guidance instead of confident guesses. | Must |
| `S23-4` | As the team, analyzer default changes are gated by evidence. | Default analyzer remains unchanged unless top-3 accuracy improves without increasing non-rock false positives. | Must |

## **Quality Gates**

| Metric | Gate |
| --- | --- |
| Top-3 accuracy | Must improve or remain stable against the previous eval baseline |
| Non-rock false positives | Must not increase |
| High-confidence non-rock mistakes | Must be zero in the curated fixture set |
| Ambiguous sample handling | Must prefer `Low` confidence and actionable next-check guidance |
| Default analyzer decision | Must be documented before any feature flag default changes |

## **Definition Of Done Checkpoint**

| DoD Criterion | Target State |
| --- | --- |
| Harder eval fixtures exist | `Yes` |
| Analyzer comparison report exists | `Yes` |
| Non-rock confidence guardrails are tested | `Yes` |
| Default analyzer decision is documented | `Yes` |
| Relevant tests pass | `Yes` |

## **Sprint 23 Tracking**

| Story | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `S23-1` | `Done` | [detection-quality-fixtures.ts](<../../../data/eval/detection-quality-fixtures.ts>), [s23-detection-quality-gates.acceptance.test.ts](<../../../__tests__/s23-detection-quality-gates.acceptance.test.ts>), [rock-id-eval.ts](<../../../lib/rock-id-eval.ts>) | Adds harder fixtures and a mock vs on-device comparison report through the eval contract |
| `S23-2` | `Done` | [s23-non-rock-guardrails.test.ts](<../../../__tests__/s23-non-rock-guardrails.test.ts>), [on-device-clip-knn-analysis.ts](<../../../lib/on-device-clip-knn-analysis.ts>) | Non-rock top matches are treated as look-alikes and avoid high-confidence messaging |
| `S23-3` | `Done` | [s23-ambiguous-low-confidence.test.ts](<../../../__tests__/s23-ambiguous-low-confidence.test.ts>), [on-device-clip-knn-analysis.ts](<../../../lib/on-device-clip-knn-analysis.ts>) | Ambiguous evidence returns `Low` confidence with next-step guidance |
| `S23-4` | `Done` | [analyzer-kind.ts](<../../../lib/analyzer-kind.ts>), [configured-analysis.ts](<../../../lib/configured-analysis.ts>) | Default analyzer remains `mock` unless explicitly overridden by config |

## **Default Analyzer Decision**

- Default analyzer stays `mock`.
- On-device analyzer remains opt-in via configuration.

## **Manual QA Notes**

- Sprint 23 is primarily non-UI unless analyzer output changes visible Results behavior.
- If Results copy changes, validate web and iPhone paths for low-confidence clarity.
- Do not flip the default analyzer during Sprint 23 unless all quality gates pass.

## **Next Technical Move**

- Create a fresh `sprint/23-*` branch from `main`.
- Start with `S23-1` on a `🧪 test-fail(...)` commit that establishes the eval fixture + reporting contract.

# **Sprint 12: Dataset + Eval Expansion (Non-Rock First)**

Sprint goal:
Expand the labeled evaluation dataset and reporting so we can measure progress toward a real Rock ID engine, with a trust-first focus on non-rock look-alikes.

Planning date:
2026-05-03

## **Why This Sprint Exists**

Sprint 11 proved the evaluation loop is useful, but the dataset is too small to guide model/engine decisions. Sprint 12 expands fixtures and adds report views that surface coverage gaps and non-rock confusions so we can prioritize the highest-trust work next.

## **Sprint Stories**

| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S12-1` | As the team, we can reuse labeled eval fixtures outside test files. | Eval fixtures live under `data/eval/` and are importable by tests and future tooling. | Must |
| `S12-2` | As the team, we can see class coverage and per-class accuracy to avoid “tiny fixture optimism”. | Eval report includes `coverage` (class/kind counts) and `perClassAccuracy` (top1/top3 per label). | Must |
| `S12-3` | As the team, we can isolate non-rock confusions for trust work. | Eval report includes `nonRockConfusions` and a `nonRockFalsePositiveRate` computed only from non-rock fixtures. | Must |
| `S12-4` | As a developer, “top 3” is defined consistently even when analyzers return more than 3 matches. | `top3Accuracy` is computed as “expected label appears in the first 3 ranked matches”. A test locks this behavior. | Must |
| `S12-5` | As the product/engineering pair, we can pick Sprint 13 based on evidence. | Sprint closeout records whether the next move is (a) dataset expansion, (b) embedding pipeline, (c) on-device inference, or (d) non-rock detection hardening. | Should |

## **Reality-Check Metrics (Sprint 12)**

| Metric | Purpose | Gate |
| --- | --- | --- |
| `coverage.kinds['non-rock']` | Ensures non-rock cases are represented | Must be `>= 4` |
| `nonRockFalsePositiveRate` | Core trust metric: avoid “forcing rock” on non-rock | Provisional target: trending downward toward `0` |
| `top3Accuracy` | Candidate-set quality | Provisional target: `>= 0.85` once dataset is larger |

## **Definition Of Done Checkpoint**

| DoD Criterion | Current State |
| --- | --- |
| Reusable fixture dataset exists under `data/eval/` | `Yes` |
| Eval report includes coverage + per-class accuracy | `Yes` |
| Eval report includes non-rock confusion breakdown | `Yes` |
| “Top 3” semantics are tested and stable | `Yes` |
| `pnpm run typecheck` passes | `Yes` |
| Relevant tests pass | `Yes` |
| No user-facing app behavior changes | `Yes` |

## **Manual QA / Review Plan**

- Review fixture labels for obvious geology mistakes (especially look-alikes: slag/glass/concrete/brick).
- Run the acceptance tests and inspect the output objects.
- Confirm `top3Accuracy` matches the definition “first 3 ranked matches”.

## **Sprint Risks**

- More fixtures can increase brittleness if the analyzer is unstable; keep acceptance checks focused on report shape + selected stable expectations.
- Mislabeling non-rock examples can mislead trust work; keep labels conservative and notes explicit.

## **Sprint 12 Tracking**

Story status snapshot:

| Story | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `S12-1` | `Done` | [starter-fixtures.ts](<../../../data/eval/starter-fixtures.ts>) | Fixtures are reusable and not embedded in test-only code |
| `S12-2` | `Done` | [rock-id-eval.ts](<../../../lib/rock-id-eval.ts>) | Coverage and per-class accuracy are reported |
| `S12-3` | `Done` | [s12-dataset-eval-expansion.acceptance.test.ts](<../../../__tests__/s12-dataset-eval-expansion.acceptance.test.ts>) | Non-rock confusions and coverage are asserted |
| `S12-4` | `Done` | [s11-rock-id-eval.acceptance.test.ts](<../../../__tests__/s11-rock-id-eval.acceptance.test.ts>) | “Top 3” is locked to first 3 ranked matches |
| `S12-5` | `Planned` | This sprint plan | Next move is on-device CLIP kNN (embedding pipeline) once fixture set is representative |


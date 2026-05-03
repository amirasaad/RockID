# **Sprint 11: Rock ID Reality Check**

Sprint goal:
Measure whether the current identification approach can credibly identify common rocks before replacing mock analysis with a real inference path.

Planning date:
2026-05-03

## **Why This Sprint Exists**

The product promise is `identify rocks`. The app flow is now credible, but the core technical risk is still the identification engine. Sprint 11 establishes a small, repeatable evaluation loop so future model work can be judged by evidence instead of demos.

## **Sprint Stories**

| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S11-1` | As the team, we can run a repeatable rock-ID evaluation against labeled examples. | Add a small labeled eval fixture with expected rock labels; add an eval runner or pure evaluation module; report `top1Accuracy`, `top3Accuracy`, low-confidence rate, and confusion pairs. | Must |
| `S11-2` | As the team, we can define reality-check thresholds before claiming the engine works. | Document MVP gate thresholds for top-1, top-3, low-confidence behavior, and non-rock false positives; mark thresholds as provisional if dataset is tiny. | Must |
| `S11-3` | As a developer, we can compare the current mock analysis behavior to the eval fixture. | Current mock analysis is evaluated through the same contract used by future inference implementations; failing classes/confusions are visible in test output or a structured result. | Must |
| `S11-4` | As the product/engineering pair, we can decide the next technical move after seeing the data. | Sprint closeout records whether the next step is dataset expansion, model endpoint integration, confidence calibration, or non-rock detection hardening. | Should |

## **Reality-Check Metrics**

| Metric | Purpose | Initial Gate |
| --- | --- | --- |
| `top1Accuracy` | Measures whether the first answer is often right | Provisional target: `>= 0.60` on the starter fixture |
| `top3Accuracy` | Measures whether the correct answer is in the candidate set | Provisional target: `>= 0.85` on the starter fixture |
| `lowConfidenceRate` | Measures how often the engine admits uncertainty | Track only in Sprint 11; tune after dataset grows |
| `nonRockFalsePositiveRate` | Measures whether slag/glass/concrete-like cases are mislabeled as rocks | Provisional target: `0` on any included non-rock examples |
| `confusionPairs` | Identifies hard classes such as granite/gneiss or basalt/slag | Must be reported when mistakes occur |

## **Acceptance Test Starter**

Start red with a non-UI acceptance test that describes the evaluation contract:

- Given a labeled eval fixture with common rock examples
- When the current analyzer is evaluated
- Then the result includes top-1 accuracy, top-3 accuracy, low-confidence rate, non-rock false-positive rate, and confusion pairs
- And the output can be reused for a future model-backed analyzer

## **Definition Of Done Checkpoint**

| DoD Criterion | Current State |
| --- | --- |
| Labeled eval fixture exists | `Pending` |
| Eval runner/module reports required metrics | `Pending` |
| Current mock analyzer can be evaluated through the same contract | `Pending` |
| Reality-check thresholds documented | `Pending` |
| Results identify at least one next technical move | `Pending` |
| `pnpm run typecheck` passes | `Pending` |
| Relevant tests pass | `Pending` |
| No MVP requirement conflicts | `Pending` |

## **Manual QA / Review Plan**

- Review eval fixture labels for obvious geology mistakes.
- Run the eval command/test locally and inspect metric output.
- Confirm confusion pairs are understandable enough to guide the next sprint.
- Confirm no user-facing app behavior changes unless intentionally added.

## **Sprint Risks**

- A tiny fixture can create false confidence; mark all thresholds provisional.
- Mock analysis may pass for the wrong reason if examples are too close to fixtures.
- Non-rock examples need careful labeling because they are product-critical trust cases.
- Reasoning copy should not be treated as model evidence until a real model endpoint exists.

## **Sprint 11 Tracking**

Story status snapshot:

| Story | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `S11-1` | `Ready` | TBD | Start with failing acceptance test |
| `S11-2` | `Ready` | This sprint plan | Thresholds are provisional until dataset grows |
| `S11-3` | `Ready` | TBD | Keep analyzer contract reusable for future backend/model |
| `S11-4` | `Ready` | TBD | Closeout should name the next technical move |

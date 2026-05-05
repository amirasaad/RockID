# **Sprint 24: Detection Fixture Expansion**

Sprint goal:
Expand the detection eval fixtures and improve on-device analyzer metrics without increasing non-rock false positives.

Planning date:
2026-05-05

## **Why This Sprint Exists**

Sprint 23 added the first set of detection quality gates and guardrails, but the fixture set is still small and can overfit to a handful of cases. Sprint 24 expands coverage and uses the larger fixture set to drive measurable improvements in the on-device analyzer while keeping non-rock safety intact.

## **Sprint Stories**

| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S24-1` | As the team, we can evaluate the analyzer against a broader and more realistic fixture set. | Fixtures expand to include more rocks, more look-alikes, and more ambiguous samples; eval report is reproducible in CI. | Must |
| `S24-2` | As a user, the on-device analyzer improves on rock accuracy without increasing non-rock mistakes. | Top-3 accuracy improves against Sprint 23 baseline and non-rock false positives do not increase on the curated set. | Must |
| `S24-3` | As the team, we can clearly see what changed and why. | Any analyzer tuning has test-backed evidence and a short reasoning note describing the change and its effect on the eval report. | Should |

## **Quality Gates**

| Metric | Gate |
| --- | --- |
| Top-3 accuracy | Must improve against the Sprint 23 baseline |
| Non-rock false positives | Must not increase |
| High-confidence non-rock mistakes | Must be zero in the curated fixture set |
| Ambiguous sample handling | Must prefer `Low` confidence and actionable next-check guidance |

## **Definition Of Done Checkpoint**

| DoD Criterion | Target State |
| --- | --- |
| Expanded eval fixtures exist | `Yes` |
| Analyzer comparison report exists | `Yes` |
| Non-rock confidence guardrails remain green | `Yes` |
| Relevant tests pass | `Yes: typecheck, full Vitest, and Playwright e2e` |

## **Sprint 24 Tracking**

| Story | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `S24-1` | `Done` | [detection-fixture-expansion-fixtures.ts](<../../../data/eval/detection-fixture-expansion-fixtures.ts>), [s24-detection-fixture-expansion.acceptance.test.ts](<../../../__tests__/s24-detection-fixture-expansion.acceptance.test.ts>) | Expands fixtures with additional samples and validates reproducible eval reports for mock vs on-device analyzer |
| `S24-2` | `Done` | [clip-knn.ts](<../../../lib/clip-knn.ts>), [s13-clip-knn.test.ts](<../../../__tests__/s13-clip-knn.test.ts>), [s24-detection-fixture-expansion.acceptance.test.ts](<../../../__tests__/s24-detection-fixture-expansion.acceptance.test.ts>) | Natural-rock tie-break improves ambiguous top-3 accuracy to the Sprint 24 gate while keeping non-rock false positives at `0` |
| `S24-3` | `Done` | [s24-detection-fixture-expansion.acceptance.test.ts](<../../../__tests__/s24-detection-fixture-expansion.acceptance.test.ts>) | Reasoning: exact non-rock scores still win; only score ties prefer natural-rock candidates before deterministic item id |

## **Manual QA Notes**

- If Results messaging changes (confidence labels, next checks), validate web and iPhone paths for clarity.

## **QA Evidence**

| Check | Result |
| --- | --- |
| Web smoke | `Pass: Playwright e2e 4 specs` |

## **Next Technical Move**

- Review Sprint 24 changes, then commit and prepare sprint merge/release closeout if approved.

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

## **QA Matrix**

| Area | Scenario | Evidence | Status |
| --- | --- | --- | --- |
| Static quality | TypeScript compile gate | `pnpm run typecheck` | `Pass` |
| Unit/regression | Full Vitest suite | `pnpm test`: 54 files / 117 tests | `Pass` |
| Retrieval ranking | Exact score ties prefer natural-rock candidates before deterministic item id | [s13-clip-knn.test.ts](<../../../__tests__/s13-clip-knn.test.ts>) | `Pass` |
| Eval gate | Expanded S24 fixture report reaches top-3 gate `>= 0.9` | [s24-detection-fixture-expansion.acceptance.test.ts](<../../../__tests__/s24-detection-fixture-expansion.acceptance.test.ts>) | `Pass` |
| Non-rock safety | Non-rock false positives remain `0` on curated fixtures | [s24-detection-fixture-expansion.acceptance.test.ts](<../../../__tests__/s24-detection-fixture-expansion.acceptance.test.ts>) | `Pass` |
| Web smoke | Core web flows including real-engine e2e remain stable | `pnpm test:e2e`: 4 Playwright specs | `Pass` |
| iPhone simulator smoke | Low-confidence Results screen remains readable and preserves action hierarchy | User-provided simulator screenshot on 2026-05-05 | `Pass with note` |
| Trust visual check | Session thumbnail should match the captured field evidence | Screenshot used a flower/landscape photo while producing a rock result; likely simulator input, not a binding bug because Results reads `session.selectedPhoto.uri` | `Follow-up QA note` |
| Android smoke | Manual Android dev-build validation | Android build lane is outside Sprint 24 scope | `Not run` |

## **Next Technical Move**

- Commit the QA matrix update, then prepare sprint merge/release closeout if approved.

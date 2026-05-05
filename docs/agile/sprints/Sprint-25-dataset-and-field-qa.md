# **Sprint 25: Dataset And Field QA**

Sprint goal:
Increase trust in real-photo detection results by curating a small, labeled field dataset and adding a repeatable QA loop that surfaces non-rock and low-confidence failure modes quickly.

Planning date:
2026-05-05

## **Why This Sprint Exists**

Sprint 24 expanded fixtures and improved on-device analyzer metrics against synthetic/curated samples while keeping non-rock false positives at zero on the curated set. The next risk is trust and drift on real field photos: we need a small, labeled, reproducible set of real images plus a lightweight QA workflow that can be rerun as the analyzer changes.

## **Sprint Stories**

| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S25-1` | As the team, we have a small, labeled field-photo dataset that represents realistic conditions. | A curated set of real photos exists with labels and brief capture notes; includes both rocks and non-rock confusers; can be referenced from tests/QA without manual guessing. | Must |
| `S25-2` | As the team, we can run a repeatable “field QA” check that flags regressions and confidence issues. | A repeatable run (script/test) produces a summary that highlights top confusions, low-confidence rate, and any high-confidence non-rock mistakes; run instructions and evidence are captured in this sprint file. | Must |
| `S25-3` | As a user, the result view is trustworthy about what image was analyzed. | Any mismatched-thumbnail or misleading result presentation discovered during field QA is either fixed or explicitly documented as non-bug with evidence. | Should |

## **Quality Gates**

| Metric | Gate |
| --- | --- |
| High-confidence non-rock mistakes | Must be zero on the curated field QA set |
| Low-confidence rate | Must be measured and tracked; changes must be explained if it moves significantly |
| Top confusions | Must be visible (top pairs and sample IDs) to guide targeted fixture additions |

## **Definition Of Done Checkpoint**

| DoD Criterion | Target State |
| --- | --- |
| Field QA set exists with labels + notes | `Yes` |
| Repeatable QA run exists | `Yes` |
| Non-rock guardrails remain green | `Yes` |
| Relevant tests pass | `Yes: typecheck, full Vitest, Playwright e2e, and post-merge e2e` |

## **Sprint 25 Tracking**

| Story | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `S25-1` | `In Progress` | [field-qa-fixtures.ts](<../../../data/eval/field-qa-fixtures.ts>) | Start by curating the smallest “trust set” that still includes rocks + non-rock confusers |
| `S25-2` | `In Progress` | [s25-field-qa.acceptance.test.ts](<../../../__tests__/s25-field-qa.acceptance.test.ts>) | First cut: run the curated set through the on-device analyzer with a reproducible encoder stub |
| `S25-3` | `Planned` |  |  |

## **Manual QA Notes**

- Validate iPhone and web “real photo” flow on at least one rock and one non-rock sample from the curated set.
- If any Results UI text changes, verify low-confidence guidance stays actionable and consistent.

## **QA Matrix**

| Area | Scenario | Evidence | Status |
| --- | --- | --- | --- |
| Static quality | TypeScript compile gate | `pnpm run typecheck` | `Planned` |
| Unit/regression | Full Vitest suite | `pnpm test` | `Planned` |
| Web smoke | Core web flows including real-engine e2e | `pnpm test:e2e` | `Planned` |
| Field QA run | Repeatable summary run over curated field set | Link to output / test snapshot | `Planned` |

## **Release Closeout**

- Not started.

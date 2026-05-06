# **Sprint 30: Dataset And Eval Expansion**

Sprint goal:
Improve the rock-identification quality gate by expanding labeled field fixtures and non-rock look-alikes in a curated, license-safe way.

Planning date:
2026-05-06

## **Epic Alignment**

| Epic | Milestone | Sprint Contribution |
| --- | --- | --- |
| `E9: Identification Engine Reality` | Eval coverage tracks real field risk | Add more representative classes, non-rock confusers, and ambiguous samples. |
| `E14: Dataset Quality` | Curated fixture set is reliable enough for release decisions | Document source/license/expected label/kind and review workflow. |
| `E13: Engine Feedback Loop` | Field feedback can become eval candidates | Promote reviewed feedback examples into fixtures only after curation. |

## **Sprint Stories**

| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S30-1` | As the team, eval coverage shows class and kind gaps. | Eval report highlights missing/low-coverage classes and non-rock types. | Must |
| `S30-2` | As the team, we add curated fixture candidates safely. | New fixtures include source/license/notes and do not use unreviewed user uploads as training data. | Must |
| `S30-3` | As the team, non-rock confusion risk is harder to miss. | Eval includes additional human-made materials and ambiguous look-alikes. | Must |

## **Quality Gates**

- `rock-id-eval` reports top-1, top-3, low-confidence rate, non-rock false positives, and top confusion pairs.
- New fixtures preserve or intentionally adjust confidence thresholds.
- No default analyzer flip occurs in this sprint.

## **Tracking**

| Story | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `S30-1` | `Review` | [rock-id-eval.ts](<../../../lib/rock-id-eval.ts>), [s30-eval-coverage-gaps.test.ts](<../../../__tests__/s30-eval-coverage-gaps.test.ts>), [s30-coverage-gap-summary.acceptance.test.ts](<../../../__tests__/s30-coverage-gap-summary.acceptance.test.ts>), [s11-rock-id-eval.acceptance.test.ts](<../../../__tests__/s11-rock-id-eval.acceptance.test.ts>) | Coverage-gap helper and summary output are implemented with ATDD+TDD+refactor evidence. |
| `S30-2` | `Backlog` | TBD | Keep license-safe. |
| `S30-3` | `Backlog` | TBD | Focus on false positive safety. |


## **DoD Evidence**

- `❌ test-fail(eval): add coverage-gap reporting spec` (`7ca6e42`)
- `✅ test-pass(eval): add coverage-gap reporting helper` (`9cb28c2`)
- `📦 refactor(eval): surface coverage gaps in summary` (`6e6a272`)
- `✨ feat(eval): add red acceptance test for coverage-gap summary` (`a9788cc`)
- `❌ test-fail(eval): require pipe-delimited missing labels in summaries` (`45a9df9`)
- `✅ test-pass(eval): use pipe-delimited missing-label summaries` (`a0576b0`)
- `📦 refactor(eval): extract coverage-gap summary formatter` (`6855114`)
- Validation: S30 coverage tests + S11 eval acceptance pass; `pnpm run typecheck` passes.

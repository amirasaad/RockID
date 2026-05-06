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
| `S30-4` | As the team, confuser fixtures stay reviewable over time. | Each Sprint 30 non-rock confuser fixture has descriptive curation notes. | Must |
| `S30-5` | As the team, fixture provenance is explicitly traceable. | Confuser fixture notes include structured source and license tags. | Must |

## **Quality Gates**

- `rock-id-eval` reports top-1, top-3, low-confidence rate, non-rock false positives, and top confusion pairs.
- New fixtures preserve or intentionally adjust confidence thresholds.
- No default analyzer flip occurs in this sprint.

## **Tracking**

| Story | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `S30-1` | `Review` | [rock-id-eval.ts](<../../../lib/rock-id-eval.ts>), [s30-eval-coverage-gaps.test.ts](<../../../__tests__/s30-eval-coverage-gaps.test.ts>), [s30-coverage-gap-summary.acceptance.test.ts](<../../../__tests__/s30-coverage-gap-summary.acceptance.test.ts>), [s11-rock-id-eval.acceptance.test.ts](<../../../__tests__/s11-rock-id-eval.acceptance.test.ts>) | Coverage-gap helper and summary output are implemented with ATDD+TDD+refactor evidence. |
| `S30-2` | `Review` | [reviewed-candidates.ts](<../../../data/eval/reviewed-candidates.ts>), [s30-curated-candidate-fixtures.acceptance.test.ts](<../../../__tests__/s30-curated-candidate-fixtures.acceptance.test.ts>), [s30-reviewed-candidates.test.ts](<../../../__tests__/s30-reviewed-candidates.test.ts>) | Reviewed-candidate fixture mapping is in place with reviewed-only gating and metadata-preserving fixture generation. |
| `S30-3` | `Review` | [sprint30-non-rock-confusers.ts](<../../../data/eval/sprint30-non-rock-confusers.ts>), [s30-non-rock-confuser-expansion.acceptance.test.ts](<../../../__tests__/s30-non-rock-confuser-expansion.acceptance.test.ts>), [s30-non-rock-confuser-shape.test.ts](<../../../__tests__/s30-non-rock-confuser-shape.test.ts>) | Non-rock confuser fixture expansion is in place for concrete/brick/plastic/slag/glass safety coverage. |
| `S30-4` | `Review` | [sprint30-non-rock-confusers.ts](<../../../data/eval/sprint30-non-rock-confusers.ts>), [s30-non-rock-confuser-metadata.acceptance.test.ts](<../../../__tests__/s30-non-rock-confuser-metadata.acceptance.test.ts>), [s30-non-rock-confuser-notes-quality.test.ts](<../../../__tests__/s30-non-rock-confuser-notes-quality.test.ts>) | Curation note requirements are enforced so each confuser fixture retains review context. |
| `S30-5` | `Review` | [sprint30-non-rock-confusers.ts](<../../../data/eval/sprint30-non-rock-confusers.ts>), [s30-non-rock-confuser-provenance.acceptance.test.ts](<../../../__tests__/s30-non-rock-confuser-provenance.acceptance.test.ts>), [s30-non-rock-confuser-provenance-format.test.ts](<../../../__tests__/s30-non-rock-confuser-provenance-format.test.ts>) | Source and license provenance tags are enforced in non-rock confuser fixture notes. |


## **DoD Evidence**

- `❌ test-fail(eval): add coverage-gap reporting spec` (`7ca6e42`)
- `✅ test-pass(eval): add coverage-gap reporting helper` (`9cb28c2`)
- `📦 refactor(eval): surface coverage gaps in summary` (`6e6a272`)
- `✨ feat(eval): add red acceptance test for coverage-gap summary` (`a9788cc`)
- `❌ test-fail(eval): require pipe-delimited missing labels in summaries` (`45a9df9`)
- `✅ test-pass(eval): use pipe-delimited missing-label summaries` (`a0576b0`)
- `📦 refactor(eval): extract coverage-gap summary formatter` (`6855114`)
- Validation: S30 coverage tests + S11 eval acceptance pass; `pnpm run typecheck` passes.

- `✨ feat(eval): add red acceptance test for curated candidate fixtures` (`7db5a6c`)
- `❌ test-fail(eval): require reviewed-candidate decision filtering` (`2bc55cf`)
- `✅ test-pass(eval): map reviewed candidates to eval fixtures` (`567a5f5`)
- `📦 refactor(eval): extract reviewed-candidate curation helpers` (`d348d71`)
- Validation: S30 reviewed-candidate tests pass and `pnpm run typecheck` passes.

- `✨ feat(eval): add red acceptance test for non-rock confuser expansion` (`6ee840b`)
- `❌ test-fail(eval): require required-label confuser coverage` (`4824e4c`)
- `✅ test-pass(eval): add sprint30 non-rock confuser fixtures` (`441e6e0`)
- Validation: S30 confuser expansion tests pass and `pnpm run typecheck` passes.

- `✨ feat(eval): add red acceptance test for confuser curation notes` (`68975df`)
- `❌ test-fail(eval): require descriptive confuser curation notes` (`72d6d57`)
- `✅ test-pass(eval): add curated notes for sprint30 confuser fixtures` (`bf568d7`)
- `📦 refactor(eval): hoist confuser curation note constants` (`5083472`)
- Validation: S30 metadata and notes-quality tests pass for non-rock confuser fixtures.

- `✨ feat(eval): add red acceptance test for confuser provenance tags` (`5847e0d`)
- `❌ test-fail(eval): require bracketed provenance tag format` (`5f97c4f`)
- `✅ test-pass(eval): add source and license tags to confuser notes` (`22b4de0`)
- `📦 refactor(eval): centralize confuser provenance tag formatting` (`3af1b1b`)
- Validation: S30 provenance acceptance/format tests pass and `pnpm run typecheck` passes.

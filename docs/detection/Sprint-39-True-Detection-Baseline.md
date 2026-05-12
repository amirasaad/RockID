# Sprint 39 True Detection Baseline

Last updated: May 13, 2026

## Decision
Pause external friend beta QA and use Sprint 39 to establish the true-detection baseline. The setup work from beta remains valuable, but the next product truth is whether the analyzer can identify known rocks and reject lookalikes with honest confidence.

## Baseline Inputs
| Input | Source | Use |
| --- | --- | --- |
| Active analyzer index | `lib/on-device-clip-knn-analysis.ts` | Defines current indexed rock and non-rock labels. |
| Known-answer test pack | `docs/beta/Known-Answer-Test-Pack.md` | Human-readable sample plan for future internal QA. |
| Eval fixtures | `data/eval/starter-fixtures.ts`, `data/eval/sprint32-non-rock-gate-fixtures.ts`, `data/eval/sprint37-evidence-fixtures.ts` | Deterministic regression surface for current gates. |
| Eval report formatter | `lib/rock-id-eval.ts` | Produces Top-1, Top-3, low-confidence, non-rock false-positive, and confusion metrics. |

## Initial Readout
| Area | Current State | Sprint 39 Interpretation |
| --- | --- | --- |
| Rock coverage | Active photo index covers Granite, Basalt, Obsidian, and Sandstone. | True detection is still narrow; broader labels should be treated as unsupported until indexed and evaluated. |
| Non-rock rejection | Active photo index covers Slag, Glass, Asphalt, Coal, Concrete, Brick, and Plastic. | This is the strongest near-term trust lever because false rock claims hurt credibility fastest. |
| Metrics | Existing eval reports expose Top-1, Top-3, low-confidence, non-rock false-positive rate, and confusions. | Sprint 39 can use existing tooling; no new metric contract is needed before the first baseline report. |
| Biggest likely gap | Dark/glassy/granular boundary cases: Basalt/Slag/Asphalt/Coal and Obsidian/Glass/Coal. | Choose one boundary cluster for Sprint 40, not all of them. |

## Baseline Gate Status
- May 13, 2026: `pnpm verify:detection-gates` passed with 3 test files and 6 tests.
- This confirms the current conservative S32/S37 detection gates remain green before Sprint 40 experiment selection.

## Sprint 39 Baseline Runbook
1. Run `pnpm verify:detection-gates` to confirm the current conservative gates still pass.
2. Run `pnpm verify:expanded-eval` when a broader regression surface is needed.
3. Summarize the report using the existing `formatRockIdEvalSummary` fields: Top-1, Top-3, low confidence, non-rock false positives, and top confusions.
4. Select exactly one failure boundary for Sprint 40.
5. Write the Sprint 40 experiment as one variable, one expected metric delta, and one rollback criterion.

## Candidate Sprint 40 Experiment
Default candidate: Basalt vs non-rock dark confusers. This boundary already has evidence, affects common field-looking samples, and directly protects against confident wrong rock claims.

Possible one-variable experiments:
- Add one or two high-signal dark-confuser fixtures and re-run gates without analyzer changes.
- Adjust only the non-rock proximity downgrade threshold and compare low-confidence/non-rock false-positive deltas.
- Add one bounded index vector for a missing dark boundary example, then verify no Top-3 regression.

## Stop / Go
- Go to Sprint 40 implementation only after the selected boundary and one-variable experiment are documented.
- Stop and narrow the scope if multiple labels, thresholds, and fixture changes are bundled together.

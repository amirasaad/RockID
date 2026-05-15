# Sprint 40 Dark Confuser Readout

Last updated: May 15, 2026

## Decision
Proceed carefully from fixture-data-only evidence to one bounded index-data proposal. Do not change analyzer thresholds, confidence policy, or user-facing copy yet.

## Active Boundary
Selected boundary: Basalt vs dark non-rock confusers: Slag, Asphalt, and Coal.

Why this boundary matters:
- It protects against a credibility-damaging failure: confidently calling a human-made or carbon-rich dark material a rock.
- It is explainable to testers later: dark, bubbly, wet, granular, or fractured samples should be handled cautiously.
- It lets the team measure one risk without broad tuning.

## Fixture Slice
| Fixture | Expected Kind | Expected Label | Intent |
| --- | --- | --- | --- |
| `s40-rock-basalt-vesicular-low-margin-a` | `rock` | `Basalt` | Low-margin basalt reference for the selected boundary. |
| `s40-non-rock-slag-rusty-vesicular-a` | `non-rock` | `Slag` | Vesicular industrial confuser near basalt. |
| `s40-non-rock-asphalt-wet-aggregate-a` | `non-rock` | `Asphalt` | Wet aggregate/glare confuser near dark granular rock. |
| `s40-non-rock-coal-dull-fractured-a` | `non-rock` | `Coal` | Dull fractured carbon-rich confuser near basalt/obsidian. |

## Gate Readout
May 15, 2026:

| Gate | Result | Notes |
| --- | --- | --- |
| `pnpm verify:detection-gates` | Pass: 4 files, 7 tests | Includes the S32/S37/S40 conservative detection gates. |
| `pnpm verify:expanded-eval` | Pass: 11 files, 19 tests | Broader regression surface remains green with the S40 slice included. |

S40 slice expectations remain intact:
- Non-rock false-positive rate is `0` for the S40 dark-confuser slice.
- Top-1 and Top-3 behavior are stable on the deterministic slice.
- The low-margin basalt sample remains visible as low-confidence evidence instead of becoming an overconfident claim.

## Next Bounded Experiment Proposal
One variable: index data only.

Proposal: add exactly one carefully documented dark-confuser neighbor to the analyzer index or fixture-backed index training surface for the Basalt vs Slag / Asphalt / Coal boundary. Prefer a non-rock confuser neighbor over a confidence-threshold change, because the current risk is boundary representation rather than global calibration.

Expected delta:
- Preserve `0` high-confidence rock claims on known Slag / Asphalt / Coal confusers.
- Preserve existing Top-3 behavior on known rock fixtures.
- Improve separability or confidence behavior for the selected dark-confuser boundary without touching UI or thresholds.

Rollback criterion:
- Revert the index-data change if any existing S32/S37/S40 non-rock gate regresses, or if the change improves one confuser while creating a new confident wrong rock claim.

## Index-Data Risk Check
The active app index is currently a small deterministic 8-dimensional reference list in `lib/on-device-clip-knn-analysis.ts`. The S40 low-margin Basalt fixture intentionally sits close to the Slag dimension, which is why the current behavior remains cautious.

Implication:
- Adding a non-rock neighbor too close to the low-margin Basalt vector can incorrectly make Slag / Asphalt / Coal the Top-1 result for a known Basalt edge case.
- Adding a Basalt neighbor too close to that edge case can make the same boundary overconfident, weakening the desired uncertainty behavior.
- Therefore the next code change should be a shadow/index experiment with explicit before/after eval evidence, not a silent production index mutation.

## Stop / Go
- Go: keep Sprint 40 active and prepare a single shadow index-data experiment branch.
- Stop: do not retune thresholds until the index-data proposal is measured and shown insufficient.

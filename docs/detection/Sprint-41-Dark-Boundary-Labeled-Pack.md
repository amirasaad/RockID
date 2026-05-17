# Sprint 41 Dark Boundary Labeled Pack

## Purpose
Sprint 40 proved the first Slag shadow-index candidate is unsafe: one added non-rock neighbor can flip a known low-margin Basalt fixture to non-rock Top-1. Sprint 41 therefore starts with labeled evidence, not another production index change.

## Minimum Pack
The pack lives in `data/eval/sprint41-dark-boundary-labeled-pack.ts` and contains six known-answer samples:

| Pair | Rock-side sample | Non-rock-side sample | Primary risk |
| --- | --- | --- | --- |
| Basalt vs Slag | Vesicular Basalt in shade | Rusty vesicular Slag | Overcorrecting Basalt into non-rock or overclaiming Slag as Basalt |
| Basalt vs Asphalt | Fresh dark Basalt break | Wet Asphalt aggregate chip | Dark granular materials becoming confident Basalt |
| Basalt vs Coal | Dull massive Basalt | Dull fractured Coal | Dark dull material confusing rock/non-rock boundary |

## Required Metadata
Each sample includes:

- Expected label and expected kind.
- Boundary cluster.
- Sample type and rationale.
- Photo conditions: lighting, distance, background, surface state.
- Acceptance checks: expected Top-3 label, confidence policy, and no high-confidence wrong-rock allowance.
- A `RockIdEvalFixture` projection for future measured gates.

## Current Policy
This is evidence scaffolding only.

- No production analyzer changes.
- No confidence threshold changes.
- No production index mutation.
- Non-rock samples must reject high-confidence rock claims.
- Rock-side boundary samples may be low confidence; useful uncertainty is acceptable.

## Next Candidate Rule
The next shadow candidate must be selected from this pack and documented with:

- Expected delta.
- Non-rock safety expectation.
- Basalt Top-3 preservation expectation.
- Rollback criteria if any known Basalt pair regresses.

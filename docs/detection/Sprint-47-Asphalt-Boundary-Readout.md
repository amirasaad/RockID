# Sprint 47 Asphalt Boundary Readout

## Decision
Keep Sprint 47 as readout-only evidence. Do not add a new production index point yet.

## What Changed
No production behavior changed in Sprint 47.

The readout adds one known-answer pressure case for an ambiguous wet-asphalt sample near the Basalt boundary.

## Evidence
Observed behavior from `__tests__/s47-asphalt-boundary-readout.test.ts`:

- The ambiguous wet-asphalt sample stays Top-1 `photo-asphalt-1`.
- The Top-1 match remains `non-rock`.
- Basalt is visible in Top-3 as the nearest rock challenger.
- The result does not become `High` confidence.
- The readout produces zero high-confidence rock claims.

## Interpretation
This is the useful shape for a non-rock boundary sample: the analyzer can see why Basalt is nearby, but it still chooses Asphalt and avoids overclaiming.

The next step should remain evidence-first. We need more known-answer pressure before another index or threshold change.

## Next Slice
Add one Coal-side readout row or one real known-answer dark-confuser fixture. Prefer whichever sample we can describe most clearly.

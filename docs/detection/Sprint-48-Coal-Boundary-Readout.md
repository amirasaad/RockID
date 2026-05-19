# Sprint 48 Coal Boundary Readout

## Decision
Keep Sprint 48 as readout-only evidence. Do not add a new production index point yet.

## What Changed
No production behavior changed in Sprint 48.

The readout adds one known-answer pressure case for an ambiguous dull-coal sample near the Basalt and Obsidian dark-material boundary.

## Evidence
Observed behavior from `__tests__/s48-coal-boundary-readout.test.ts`:

- The ambiguous dull-coal sample stays Top-1 `photo-coal-1`.
- The Top-1 match remains `non-rock`.
- Basalt is visible in Top-3 as the nearest rock challenger.
- The result does not become `High` confidence.
- The readout produces zero high-confidence rock claims.

## Interpretation
This completes the first readout pass over the selected dark Basalt boundary from the non-rock side: Slag evidence exists from the earlier dark-boundary pack, Asphalt has an explicit Sprint 47 pressure row, and Coal now has an explicit Sprint 48 pressure row.

The next useful step is no longer another synthetic boundary row by default. Prefer a real known-answer dark-confuser sample or a tiny production candidate only if the readouts show a clear, bounded failure.

## Next Slice
Choose one real known-answer dark-confuser photo candidate for evidence capture, or promote no behavior change and summarize the dark-boundary readout arc.

# Sprint 46 Basalt Boundary Readout

## Decision
Keep the Sprint 45 Basalt support point and use it as evidence for the next bounded dark-boundary slice.

## What Changed
No production behavior changed in Sprint 46.

The readout compares the current production index against the pre-Sprint-45 index on the six-sample Sprint 41 dark-boundary pack:

- Basalt vs Slag
- Basalt vs Asphalt
- Basalt vs Coal

## Evidence
`photo-basalt-vesicular-shade-support-1` improves the vesicular Basalt boundary without making a high-confidence rock claim near Slag.

Observed behavior from `__tests__/s46-basalt-boundary-readout.test.ts`:

- Before Sprint 45, `s41-rock-basalt-vesicular-shade-a` was Top-1 `photo-basalt-1`.
- After Sprint 45, the same sample is Top-1 `photo-basalt-vesicular-shade-support-1`.
- Basalt remains visible in Top-3 for every rock-side sample.
- Every known non-rock dark confuser keeps its expected label visible in Top-3.
- Non-rock samples produce zero high-confidence rock claims.
- The vesicular Basalt boundary remains `Low` confidence, preserving honest uncertainty near Slag.

## Interpretation
Sprint 45 did not make the app broadly smarter at rock ID. It made one known Basalt boundary better represented while preserving the conservative confidence posture.

This is enough to keep the support point. It is not enough to broaden claims or add another production index candidate yet.

## Next Slice
Add a second readout-only boundary candidate or known-answer fixture for the next highest-risk dark confuser. Prefer evidence before behavior:

1. Add one new labeled fixture or readout row.
2. Compare against Sprint 46 baseline.
3. Change production behavior only if the failure mode is isolated and gates stay green.

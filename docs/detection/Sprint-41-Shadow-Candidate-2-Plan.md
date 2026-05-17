# Sprint 41 Shadow Candidate 2 Plan

## Candidate
Shadow Candidate 2 should be a rock-side Basalt support candidate, not another near-boundary non-rock neighbor.

Source pair:
- Rock-side: `s41-rock-basalt-vesicular-shade-a`
- Non-rock-side guard: `s41-non-rock-slag-rusty-vesicular-a`

## Why This Candidate
Sprint 40 showed that adding a single Slag neighbor near the Basalt boundary is unsafe: it can flip a known low-margin Basalt sample to non-rock Top-1. The next experiment should test whether a paired Basalt support point can preserve Basalt Top-3 usefulness while keeping Slag under a no-confident-rock-claim policy.

## One-Variable Experiment
Change only the shadow index used by a test. Do not mutate production index data yet.

Candidate shape:
- Add exactly one Basalt support neighbor near the vesicular shaded Basalt sample.
- Keep the existing Slag / Asphalt / Coal reference points unchanged.
- Re-run the S32/S37/S40/S41 detection gates.

## Expected Delta
- `s41-rock-basalt-vesicular-shade-a` keeps `Basalt` in Top-3.
- `s41-non-rock-slag-rusty-vesicular-a` does not become a high-confidence rock claim.
- Existing S32/S37/S40 non-rock false-positive behavior remains at `0`.
- Confidence may stay Low or Medium for rock-side boundary cases; uncertainty is acceptable.

## Rollback Criteria
Reject the candidate if any of these happen:

- A known non-rock confuser becomes a high-confidence rock claim.
- The prior S40 low-margin Basalt guard loses Basalt from Top-3.
- Top-3 behavior regresses on existing rock fixtures beyond current gate tolerance.
- The candidate requires any threshold/UI/analyzer behavior change to look good.

## Promotion Rule
Passing a shadow test is not enough to promote to production. Promotion requires a second sprint decision with:

- Before/after report.
- Confusion-pair readout.
- Release-build gate evidence.
- Explicit stop/go note in Sprint 41 or Sprint 42 docs.

## Shadow Readout
May 17, 2026:

Candidate 2 is safe as shadow evidence only.

- The Basalt-side boundary query keeps `Basalt` visible in Top-3 and selects the Basalt support neighbor.
- The Slag-side guard keeps `Slag` visible in Top-3.
- The Slag-side guard is not a `High` confidence rock claim because non-rock proximity remains active.
- Production analyzer/index data remains unchanged.

Decision:
- Keep Candidate 2 as a measured shadow candidate.
- Do not promote in this slice.
- Next useful step is a paired before/after report across the S41 pack, then a stop/go call for a production index mutation in a later sprint.

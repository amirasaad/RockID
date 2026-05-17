# Sprint 42 Production Index Decision

## Decision
Do not promote the Basalt-side support neighbor to production index data.

## Candidate Tested
Candidate: `photo-basalt-vesicular-shade-support-1`

- Label: `Basalt`.
- Kind: `rock`.
- Embedding: `[0, 0.6, 0.05, 0, 0, 0, 0, 0]`.
- Intended effect: support the S41 vesicular Basalt boundary while preserving Slag Top-1 on the known Slag guard.

## What Happened
The targeted S42 test passed, but the broader expanded eval caught an unacceptable side effect:

- `pnpm verify:expanded-eval` failed in `s25-field-qa.acceptance.test.ts`.
- Top-1 and Top-3 stayed correct.
- Low-confidence rate regressed from `1 / 7` to `2 / 7`.
- Cause: clear Basalt became Low confidence because the added Basalt support neighbor sat too close to the existing Basalt anchor, collapsing the confidence margin.

## Final Production Change
None.

Rollback was applied:

- No production analyzer behavior changed.
- No production index data changed.
- No confidence threshold changed.
- No UI/API/result contract changed.

## Gate Readout
May 17, 2026:

| Gate | Result | Notes |
| --- | --- | --- |
| `pnpm vitest run __tests__/s42-production-index-decision.test.ts` | Pass, 1 file / 1 test | Documents the rollback signal: the candidate makes clear Basalt Low confidence in a shadow index. |

## Stop / Go
Stop for production promotion.

Next useful step:
- Keep Candidate 2 shadow-only.
- Investigate confidence scoring that is aware of duplicate same-label neighbors, or gather real embeddings before another production index mutation.
- Do not alter thresholds to force this candidate through.

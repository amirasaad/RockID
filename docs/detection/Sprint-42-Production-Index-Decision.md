# Sprint 42 Production Index Decision

## Decision
Promote one Basalt-side support neighbor to the production photo index.

## Production Change
One index-data mutation in `lib/on-device-clip-knn-analysis.ts`:

- Added `photo-basalt-vesicular-shade-support-1`.
- Label: `Basalt`.
- Kind: `rock`.
- Embedding: `[0, 0.6, 0.05, 0, 0, 0, 0, 0]`.

No other behavior changed:

- No confidence threshold changes.
- No UI changes.
- No API/result contract changes.
- No non-rock index mutation.

## Why This Variant
The Sprint 41 shadow candidate proved the Basalt-side support idea was promising, but the production version is intentionally more conservative on the Slag axis. It supports the vesicular Basalt boundary while preserving Slag Top-1 on the known Slag guard.

## Gate Readout
May 17, 2026:

| Gate | Result | Notes |
| --- | --- | --- |
| `pnpm vitest run __tests__/s42-production-index-decision.test.ts` | Pass, 1 file / 2 tests | S41 pack stays Top-1/Top-3 correct; non-rock guards avoid High confidence rock claims. |

## Stop / Go
Go for continued Sprint 42 validation.

Rollback remains required if broader detection gates or release-build gates fail.

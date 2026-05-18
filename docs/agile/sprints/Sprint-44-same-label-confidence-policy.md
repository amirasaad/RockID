# Sprint 44 - Same-Label Confidence Policy

## Goal
Promote the Sprint 43 shadow insight into production confidence policy: same-label support neighbors should count as corroboration, not as opposition, while different labels and non-rock neighbors still challenge confidence.

## Stories
| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S44-1` | As the team, we make confidence margin same-label aware. | Production kNN confidence compares the top match against the nearest different label/kind. | Must |
| `S44-2` | As the team, we preserve non-rock safety. | A close non-rock boundary still avoids high-confidence rock claims. | Must |
| `S44-3` | As the team, we keep all thresholds and public result contracts unchanged. | No threshold, API, UI, or index expansion is included. | Must |
| `S44-4` | As the team, we validate against expanded eval before merge. | Detection gates, expanded eval, and release build gate pass. | Must |

## Acceptance Gates
- No confidence threshold changes.
- No index-data expansion.
- No app API or result contract changes.
- Non-rock high-confidence rock claims remain blocked.
- `pnpm verify:detection-gates` must pass.
- `pnpm verify:expanded-eval` must pass before merge.
- `pnpm verify:release-builds` must pass before merge to `main`.

## Starting Evidence
- [Sprint 42 Production Index Decision](../../detection/Sprint-42-Production-Index-Decision.md)
- [Sprint 43 Same-Label Confidence Shadow](<Sprint-43-same-label-confidence-shadow.md>)

## Implementation Note
The production change is intentionally one variable: confidence margin now uses the nearest different label/kind as the challenger. Same-label support neighbors can raise confidence only when no different-label challenger is close enough to keep the result uncertain.

## Current Progress
- `S44-1`: Implemented same-label-aware production confidence margin.
- `S44-2`: Updated boundary coverage to keep nearby non-rock challengers conservative.
- `S44-3`: No threshold, API, UI, or index expansion included.
- `S44-4`: Detection gates and expanded eval pass; release-build gate pending.

## Gate Evidence
- `pnpm vitest run __tests__/s13-clip-knn-retrieval.acceptance.test.ts __tests__/s34-confidence-boundary-policy.acceptance.test.ts __tests__/s43-same-label-confidence-shadow.test.ts`: Pass.
- `pnpm typecheck`: Pass.
- `pnpm verify:detection-gates`: Pass.
- `pnpm verify:expanded-eval`: Pass.

## Decision
Proceed to release-build gate. The production policy change is bounded to confidence margin calculation and keeps thresholds, index data, API, and UI unchanged.

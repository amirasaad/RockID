# Sprint 45 - Basalt Support Index Promotion

## Goal
Re-test and promote the Sprint 42 Basalt support index candidate now that Sprint 44 made confidence margin same-label aware.

## Stories
| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S45-1` | As the team, we apply exactly one production index-data mutation. | Only `photo-basalt-vesicular-shade-support-1` is added to the production photo index. | Must |
| `S45-2` | As the team, we prove the old S42 regression stays closed. | Clear Basalt remains high confidence with the same-label support neighbor present. | Must |
| `S45-3` | As the team, we preserve non-rock and expanded eval gates. | Detection gates and expanded eval pass without threshold, API, UI, or result-contract changes. | Must |
| `S45-4` | As the team, we document whether the candidate is now safe to keep. | Sprint close states keep, rollback, or gather more evidence. | Should |

## Acceptance Gates
- One index-data mutation only.
- No confidence threshold changes.
- No app API or result contract changes.
- Non-rock high-confidence rock claims remain blocked.
- `pnpm verify:detection-gates` must pass.
- `pnpm verify:expanded-eval` must pass before merge.
- `pnpm verify:release-builds` must pass before merge to `main`.

## Starting Evidence
- [Sprint 42 Production Index Decision](../../detection/Sprint-42-Production-Index-Decision.md)
- [Sprint 44 Same-Label Confidence Policy](<Sprint-44-same-label-confidence-policy.md>)

## Candidate
`photo-basalt-vesicular-shade-support-1`

- Label: `Basalt`
- Kind: `rock`
- Embedding: `[0, 0.6, 0.05, 0, 0, 0, 0, 0]`

## Current Progress
- `S45-1`: Candidate added as one bounded production index mutation.
- `S45-2`: Targeted regression coverage updated for same-label-aware confidence.
- `S45-3`: Detection gates and expanded eval passed with no threshold, API, UI, or result-contract changes.
- `S45-4`: Candidate is safe to keep with release-build gate passed.

## Gate Evidence
- `pnpm vitest run __tests__/s42-production-index-decision.test.ts __tests__/s43-same-label-confidence-shadow.test.ts`: passed, 2 files / 3 tests.
- `pnpm typecheck`: passed.
- `pnpm verify:detection-gates`: passed, 9 files / 16 tests.
- `pnpm verify:expanded-eval`: passed, 16 files / 28 tests.
- `pnpm verify:release-builds`: passed with iOS and Android native builds.

## Decision
Keep `photo-basalt-vesicular-shade-support-1` as the first production Basalt support index point.

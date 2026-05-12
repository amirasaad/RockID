# Sprint 39 — True Detection Foundation

## Goal
Pause external beta QA and move the next arc toward true rock detection. The sprint should answer: what does the current analyzer actually identify well, where does it fail, and what is the smallest next experiment that could improve real detection quality?

This is not a tester-recruitment sprint and not a broad tuning sprint. We are getting out of the beta-ops maze and back to the mountain: useful, honest rock identification.

## Stories
| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S39-1` | As the team, beta QA is explicitly paused without losing the setup work. | Kanban, milestones, and beta QA docs say external friend QA is paused until true-detection baseline improves. | Must |
| `S39-2` | As the team, current true-detection capability is measured. | Baseline report captures Top-1, Top-3, confidence bands, confident-wrong cases, and non-rock false positives for the known-answer pack. | Must |
| `S39-3` | As the team, target detection scope is clear. | Supported target taxonomy separates core rock labels, near-neighbor lookalikes, and non-rock confusers. | Must |
| `S39-4` | As the team, the biggest detection gap is selected from evidence. | One top failure cluster is chosen with example fixtures and expected behavior. | Must |
| `S39-5` | As the team, Sprint 40 has one bounded experiment ready. | Experiment proposal changes only one variable: fixture data, similarity/indexing, threshold/calibration, or analyzer rule. | Should |

## Acceptance Gates
- No app API or user-facing result contract changes.
- No broad confidence retuning from anecdotes.
- Baseline report must include Top-1, Top-3, confident wrong, non-rock false positives, and top confusion clusters.
- Any proposed Sprint 40 change must name exactly one variable and one expected measurable delta.
- `pnpm verify:release-builds` remains green before any release-worthy merge.

## Evidence To Produce
- Current detection baseline summary using the known-answer pack: [Sprint 39 True Detection Baseline](../../detection/Sprint-39-True-Detection-Baseline.md).
- Target taxonomy note: [True Detection Target Taxonomy](../../detection/True-Detection-Target-Taxonomy.md).
- One selected failure cluster for Sprint 40.
- One bounded experiment proposal with rollback criteria.

## Current Status
- `S39-1` is in progress: beta QA is paused in planning docs while beta artifacts remain available.
- `S39-2` and `S39-3` have starting artifacts; `pnpm verify:detection-gates` passed on May 13, 2026.
- `S39-4` selected Basalt vs Slag / Asphalt / Coal as the Sprint 40 boundary.
- `S39-5` proposes fixture-data-only as the first bounded experiment: add dark-confuser variants before changing analyzer behavior.

## Guardrails
- Keep beta ops available but paused.
- Do not ask friends for more testing until we can explain what signal we need from them.
- Favor honest uncertainty over confident wrong rock IDs.
- Tiny steps only: one hypothesis, one bounded change, one eval report.

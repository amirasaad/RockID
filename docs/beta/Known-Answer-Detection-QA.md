# Known-Answer Detection QA

Last updated: May 13, 2026

## Purpose
Use known-answer testing to answer one product question: when we already know what the sample is, does RockID behave usefully and honestly?

Status: paused for external friend beta. Keep this guide as internal QA scaffolding while Sprint 39 moves toward true detection foundation work. This is not a public accuracy claim.

## Test Pack
Prepare at least 20 known-answer attempts across these groups. Use [Known-Answer Test Pack](Known-Answer-Test-Pack.md) as the default sample checklist:

| Group | Target Count | Examples | Expected Behavior |
| --- | ---: | --- | --- |
| Clear rocks | 8+ | labeled quartz, granite, sandstone, basalt, limestone, marble, obsidian-like, slate-like | Expected answer appears in Top-3 when visual evidence is reasonable. |
| Ambiguous rocks | 4+ | poor lighting, mixed background, far distance, partial sample | Confidence should downgrade when visual evidence is weak. |
| Non-rock confusers | 8+ | glass, concrete, brick, slag, asphalt, plastic, ceramic, mixed-material scene | Avoid high-confidence rock claims. |

## Attempt Record
For every attempt, capture the result in [Known-Answer Attempt Log](Known-Answer-Attempt-Log.md):

| Field | Required? | Notes |
| --- | --- | --- |
| Expected answer | Yes | Known label before scanning, or `non-rock` for confusers. |
| Shown `topMatch` | Yes | Exact app output. |
| Alternatives | Yes | Top alternatives shown by the app. |
| Confidence band | Yes | Low, medium, or high as displayed. |
| Photo conditions | Yes | Lighting, distance, background, blur, wet/dry surface. |
| Useful? | Yes | Tester judgment: useful, misleading, unclear, or blocked. |
| Saved/reopened? | For mission C | Confirm local persistence and reanalysis still work. |

## Pass / Fail Gates
- At least 20 completed known-answer attempts.
- At least 70% Top-3 usefulness across known rock samples.
- Zero high-confidence wrong rock IDs.
- Zero high-confidence rock claims on known non-rock confusers.
- 100% of GitHub beta reports triaged into the Wave milestone within 24h.

## Triage Rules
- Confident wrong cases are `beta-priority-high` until explained or fixed.
- Non-rock high-confidence rock claims are `beta-priority-high` until reproduced in eval.
- Low-confidence ambiguous outputs are usually acceptable if the uncertainty copy is clear.
- Do not tune thresholds from one report; first group reports into a reproducible failure cluster.

## Sprint 38 Summary
Use [Wave-1 Trust Summary](Wave-1-Trust-Summary.md) to close the sprint with explicit pass/fail gates and the next distribution decision. Run `pnpm qa:known-answer` to summarize the current attempt log before making the decision.

## May 13, 2026 Pause Decision
External friend QA is paused. The app setup and feedback channel are ready, but the next product need is stronger true detection: a measured baseline, clearer target taxonomy, and one bounded engine experiment before asking testers for more scans.

## Sprint 38 Decision Options
| Decision | Use When |
| --- | --- |
| Broaden friends beta | Gates pass and tester flow is stable. |
| Run another known-answer pass | UX/build is stable, but evidence count or label coverage is too thin. |
| Pause or soften detection claims | Any confident-wrong or non-rock high-confidence gate fails without a bounded fix. |

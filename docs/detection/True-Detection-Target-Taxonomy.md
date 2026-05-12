# True Detection Target Taxonomy

Last updated: May 13, 2026

## Purpose
Define the detection surface for the next milestone so RockID can improve actual rock identification without overclaiming. This document separates what the app can try to identify, what should be treated as a lookalike/confuser, and what must remain uncertain until the model/index improves.

## Current Analyzer Surface
The on-device CLIP kNN path currently uses a compact prototype index in `lib/on-device-clip-knn-analysis.ts`. It is useful for guardrails and regression tests, but it is not yet a broad field-photo rock classifier.

| Group | Labels | Product Meaning |
| --- | --- | --- |
| Core rock labels currently indexed | Granite, Basalt, Obsidian, Sandstone | These are the only labels the current photo-index path can strongly exercise as rock matches. |
| Non-rock lookalikes currently indexed | Slag, Glass, Asphalt, Coal, Concrete, Brick, Plastic | These should prevent confident rock claims when the photo looks artificial or human-made. |
| Fixture-only / aspirational rock labels | Limestone, Shale, Conglomerate, Marble, Slate, Gneiss, Quartzite | These appear in fixture/docs coverage but are not represented in the active on-device photo index yet. Treat as coverage gaps, not supported claims. |

## Sprint 39 Target Scope
Sprint 39 should measure the current analyzer against known-answer fixtures, then choose one narrow next experiment. The default candidate scope is not broad taxonomy expansion; it is improving trust on the highest-risk boundary.

| Priority | Boundary | Why It Matters | Candidate Evidence |
| --- | --- | --- | --- |
| 1 | Basalt vs Slag / Asphalt / Coal | Dark vesicular or granular samples are easy to overclaim as rocks. | S32/S37 non-rock gates and basalt-dark-vesicular boundary fixtures. |
| 2 | Obsidian vs Glass / Coal | Glassy dark surfaces can create plausible but misleading volcanic-rock IDs. | S30/S33/S37 non-rock confuser patterns. |
| 3 | Sandstone vs Brick / Concrete | Tan/red granular human-made materials can look sedimentary in photos. | S37 Sandstone addition plus S32 brick/concrete variants. |

## Product Contract
- If the target label is outside the active analyzer surface, prefer uncertainty over a confident exact claim.
- Non-rock lookalikes are product safety labels, not user-facing taxonomy expansion.
- A Sprint 40 detection change must affect exactly one variable: fixture data, similarity/indexing, threshold/calibration, or analyzer rule.
- Do not recruit more friend beta testers until the team can explain which boundary it needs them to test.

# **Sprint 26: Real Engine Confidence Hardening**

Sprint goal:
Calibrate confidence thresholds using Sprint 25 field QA data, harden non-rock detection, and expand curated fixtures with edge cases before enabling the real engine by default.

Planning date:
2026-05-06

## **Why This Sprint Exists**

Sprint 25 established a field QA dataset and repeatable QA loop. Sprint 26 uses this data to improve the analyzer's confidence calibration and non-rock detection before the real engine becomes the default.

## **Sprint Stories**

| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S26-1` | As the team, confidence thresholds are calibrated based on field QA results. | Thresholds maximize top-3 accuracy on rocks while keeping non-rock false positives at zero; rationale documented in sprint notes. | Must |
| `S26-2` | As a user, non-rock detection is hardened to prevent high-confidence false positives. | Zero high-confidence non-rock mistakes on expanded fixture set; improved detection logic uses similarity analysis. | Must |
| `S26-3` | As the team, the field QA dataset includes edge cases and additional confusers. | Fixtures include poor lighting, blur, partial frame, mixed materials; additional non-rock types (concrete, brick, plastic) added. | Must |

## **Quality Gates**

| Metric | Gate |
| --- | --- |
| High-confidence non-rock mistakes | Zero on expanded fixture set (7 non-rock samples) |
| Non-rock false positive rate | Zero on curated field QA set |
| Top-3 accuracy on field QA set | >= Sprint 25 baseline (>= 0.9) |
| Low-confidence rate on edge cases | Trackable and > 0 for ambiguous samples |
| Coverage: non-rock confusers | >= 7 distinct types |
| Coverage: edge case conditions | >= 4 distinct conditions |

## **Definition Of Done Checkpoint**

| DoD Criterion | Target State |
| --- | --- |
| Confidence thresholds calibrated | `Yes` |
| Non-rock detection hardened | `Yes` |
| Expanded fixtures with edge cases | `Yes` |
| All quality gates passing | `Yes` |
| Relevant tests pass | `Yes: typecheck, S26 acceptance tests` |

## **Sprint 26 Tracking**

| Story | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `S26-1` | `Done` | [confidence-thresholds.ts](<../../../lib/confidence-thresholds.ts>), [s26-confidence-calibration.acceptance.test.ts](<../../../__tests__/s26-confidence-calibration.acceptance.test.ts>) | Added `getCalibratedConfidenceThresholds()` with tightened margins; high: 0.55/0.18, medium: 0.4/0.1 |
| `S26-2` | `Done` | [clip-knn.ts](<../../../lib/clip-knn.ts>), [s26-non-rock-hardening.acceptance.test.ts](<../../../__tests__/s26-non-rock-hardening.acceptance.test.ts>) | Improved `isPossibleNonRock()` to check similarity gaps between top rock and non-rock matches |
| `S26-3` | `Done` | [field-qa-fixtures.ts](<../../../data/eval/field-qa-fixtures.ts>), [on-device-clip-knn-analysis.ts](<../../../lib/on-device-clip-knn-analysis.ts>) | Added 7 new fixtures: concrete, brick, plastic (non-rock); poor-light, partial-frame, blurry, mixed-materials (edge case rocks); updated photoIndex with new items |

## **Technical Changes**

### Confidence Threshold Calibration
- **File:** `lib/confidence-thresholds.ts`
- **Change:** Added `getCalibratedConfidenceThresholds()` with tighter margins
- **Old:** high: 0.45/0.12, medium: 0.3/0.05
- **New:** high: 0.55/0.18, medium: 0.4/0.1
- **Rationale:** Sprint 25 field QA showed ambiguous samples were getting High confidence; tighter margins reduce false positives

### Non-Rock Detection Hardening
- **File:** `lib/clip-knn.ts`
- **Change:** Enhanced `isPossibleNonRock()` function
- **Before:** Simple check for non-rock top match or >= 2 non-rock in results
- **After:** Added similarity gap analysis - if top match is rock but close to a non-rock (< 0.2 gap), flag as possible non-rock
- **Rationale:** Prevents high-confidence rock predictions when non-rock is competitively similar

### Fixture Expansion
- **File:** `data/eval/field-qa-fixtures.ts`
- **New fixtures:**
  - `field-rock-granite-poor-light` - Poor lighting conditions
  - `field-rock-basalt-partial-frame` - Partially out of frame
  - `field-rock-obsidian-blurry` - Motion blur
  - `field-rock-mixed-materials` - Rock on non-rock surface
  - `field-non-rock-concrete-a` - Human-made concrete
  - `field-non-rock-brick-a` - Fired clay brick
  - `field-non-rock-plastic-a` - Synthetic plastic
- **File:** `lib/on-device-clip-knn-analysis.ts`
- **Change:** Added new items to photoIndex with appropriate embeddings

## **QA Matrix**

| Area | Scenario | Evidence | Status |
| --- | --- | --- | --- |
| Static quality | TypeScript compile gate | `pnpm run typecheck` | `Pass` |
| Confidence calibration | Calibrated thresholds improve edge case handling | [s26-confidence-calibration.acceptance.test.ts](<../../../__tests__/s26-confidence-calibration.acceptance.test.ts>) | `Pass (2/2)` |
| Non-rock hardening | Zero high-confidence non-rock mistakes on 7 samples | [s26-non-rock-hardening.acceptance.test.ts](<../../../__tests__/s26-non-rock-hardening.acceptance.test.ts>) | `Pass (3/3)` |
| Fixture expansion | 14 total fixtures (7 rock, 7 non-rock) with edge cases | [field-qa-fixtures.ts](<../../../data/eval/field-qa-fixtures.ts>) | `Pass` |

## **Next Technical Move**

- Sprint 27: Enable real engine by default if confidence in S26 hardening is high
- Or: Additional hardening sprint if field testing reveals new edge cases

## **Release Closeout**

- Not yet merged to main (pending Sprint 27 decision on default enablement)
- Branch: `sprint/26-confidence-hardening`

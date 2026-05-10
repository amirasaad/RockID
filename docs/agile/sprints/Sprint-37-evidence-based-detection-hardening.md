# Sprint 37 — Evidence-Based Detection Hardening

## Goal
Use beta wrong-result evidence to harden detection with tiny, measurable fixture and analyzer changes.

## Stories
| ID | Story | Acceptance Criteria | Priority | Status |
| --- | --- | --- | --- | --- |
| `S37-1` | As the team, beta wrong-result clusters become reviewable eval candidates. | Top reproducible clusters from Sprint 36 are promoted into small fixture slices with source notes. | Must | **In Progress** |
| `S37-2` | As the team, detection improves through one bounded change. | At most one analyzer/calibration variable changes and the delta is measured against Sprint 34 baseline. | Must | **In Progress** |
| `S37-3` | As a tester, the app avoids overclaiming near non-rock boundaries. | Non-rock false-positive and low-confidence behavior gates stay green. | Must | **In Progress** |
| `S37-4` | As the team, the next confusion target is visible. | Eval report includes top confusions for the following sprint or wave. | Should | **In Progress** |

## Planned Exit Criteria
- `pnpm verify:detection-gates` passes.
- `pnpm verify:release-builds` passes before merge.
- No top-1/top-3 regression beyond Sprint 34 tolerance.
- Fixture additions are small, sourced from beta evidence, and documented.

## Evidence To Capture
- Fixture source notes linked back to GitHub beta issues.
- Baseline-vs-delta report.
- Non-rock false-positive, low-confidence, and top-confusion metrics.

## Guardrails
- No multi-variable tuning.
- Prefer uncertainty over overconfident wrong labels.
- Roll back to last passing config if gates fail.

## Evidence Snapshot (In Progress — May 10, 2026)

### S37-1: Fixture Slice
- Source: No Wave 1 tester wrong-result reports yet (wave opened May 8). Fixture candidates derived from S32/S33 gate confusion patterns and known field confuser overlaps.
- `data/eval/sprint37-evidence-fixtures.ts` — 4 fixtures (2 rock, 2 non-rock):
  - `s37-rock-basalt-dark-vesicular-b` — Basalt/Slag non-rock boundary cluster (dark vesicular)
  - `s37-rock-sandstone-layered-a` — New rock class (sedimentary coverage gap)
  - `s37-non-rock-asphalt-rough-a` — Asphalt dark-granular boundary
  - `s37-non-rock-coal-shiny-a` — Coal/Obsidian confusion risk (from S33 cluster brief)

### S37-2: One Bounded Change
- Variable changed: `photoIndex` in `lib/on-device-clip-knn-analysis.ts`
- Change: Added `photo-sandstone-1` (Sandstone, kind: rock) at embedding `normalizeVector([0, 0, 0, 0, 0, 0, 0, 1])`.
- No confidence threshold changes; no proximity margin changes.

### S37-3/S37-4: Gate Status
- `__tests__/s37-evidence-detection-hardening.test.ts` added to `pnpm verify:detection-gates`.
- Combined S32 + S37 fixture set: 14 total (5 rock, 9 non-rock).
- Expected metrics vs Sprint 34 baseline (top1=0.76, top3=0.92):
  - nonRockFalsePositiveRate: 0.0
  - lowConfidenceRate: ≥ 0.14 (ambiguous granite + basalt boundary fixture both Low)
  - top1Accuracy: ~0.929 (regression: 0.0, well within 0.03 tolerance)
  - top3Accuracy: ~0.929 (regression: 0.0, within 0.02 tolerance)
  - topConfusions: Granite → Brick (1 sample; ambiguous-shaded-a)

# **Sprint 31: Calibration Release Candidate**

Sprint goal:
Use expanded eval evidence to decide whether the current real-engine default remains release-safe, then cut a build only if iOS and Android gates pass.

Planning date:
2026-05-06

## **Epic Alignment**

| Epic | Milestone | Sprint Contribution |
| --- | --- | --- |
| `E11: Real Engine Integration` | Default engine is safe under current evidence | Calibrate thresholds and fallback messaging from S29/S30 findings. |
| `E12: Release Stability` | Release candidate passes iOS and Android build gates | Run full release gate before any version bump. |
| `E14: Dataset Quality` | Eval gate drives release decisions | Decide whether dataset gaps block release or become next sprint scope. |

## **Sprint Stories**

| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S31-1` | As the team, thresholds reflect current eval evidence. | Confidence thresholds and non-rock warnings are reviewed against S30 report. | Must |
| `S31-2` | As a user, uncertainty messaging remains honest. | Low-confidence and non-rock states do not overclaim certainty. | Must |
| `S31-3` | As the team, release candidate build is platform-stable. | `pnpm run verify:release-builds` passes before any `v0.28.x` bump. | Must |
| `S31-4` | As the team, release notes are useful. | Changelog has a user-facing feature/fix note when release is intentionally bumped. | Should |

## **Quality Gates**

- Full eval report attached to sprint notes.
- `pnpm run verify:release-builds` passes before bump.
- Changelog is non-empty for intentionally user-visible releases.
- Web/iPhone/Android smoke notes recorded if build reaches devices.

## **Tracking**

| Story | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `S31-1` | `Backlog` | TBD | Depends on Sprint 30. |
| `S31-2` | `Backlog` | TBD | Preserve trust-first UX. |
| `S31-3` | `Backlog` | TBD | Release gate is mandatory. |
| `S31-4` | `Backlog` | TBD | Prevent empty changelog repeats. |

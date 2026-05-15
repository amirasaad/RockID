# Sprint 40 - Dark Confuser Index Experiment

## Goal
Improve true-detection trust with one bounded experiment around the Basalt vs Slag / Asphalt / Coal boundary selected in Sprint 39.

This sprint is intentionally small. We are not broadening the product claim yet; we are testing whether a tiny evidence-led change can reduce dark non-rock confusion without weakening the conservative detection gates.

## Stories
| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S40-1` | As the team, Sprint 39 is closed and Sprint 40 starts from the gated baseline. | `main` is pushed after the release-build gate, the Sprint 40 branch is aligned to `main`, and scrum docs show Sprint 40 in progress. | Must |
| `S40-2` | As the team, the dark-confuser fixture slice is treated as the active experiment surface. | S40 fixture docs/tests identify Basalt vs Slag / Asphalt / Coal as the only active boundary. | Must |
| `S40-3` | As the team, one index-data experiment is proposed before analyzer behavior changes. | The change names exactly one variable, expected delta, and rollback criterion. | Must |
| `S40-4` | As the team, detection and release gates prove the experiment is safe or unsafe. | Shadow candidate evidence is captured, `pnpm verify:detection-gates`, expanded eval where relevant, and `pnpm verify:release-builds` pass before any sprint-worthy merge. | Must |

## Acceptance Gates
- No app API or user-facing result contract changes.
- No broad confidence threshold retuning.
- No multi-variable analyzer/index/calibration bundle.
- Non-rock dark-confuser high-confidence rock claims remain at 0 on the gated slice.
- Any detected failure becomes evidence for Sprint 41 instead of being patched opportunistically.

## Evidence To Produce
- Updated dark-confuser eval summary against the Sprint 39 baseline: [Sprint 40 Dark Confuser Readout](../../detection/Sprint-40-Dark-Confuser-Readout.md).
- One clear stop/go decision: keep fixture-data-only, promote one index-data change, or stop and narrow further.
- Scrum board update after each story branch merge.

## Current Status
- Sprint 40 is closed and ready to merge.
- `S40-1` is done: `main` is pushed at the Sprint 39 gated baseline and `sprint/40-dark-confuser-index-experiment` has been realigned to that baseline.
- `S40-2` is done: the existing S40 fixture slice is present, documented, and included in detection gates.
- May 15, 2026: `pnpm verify:detection-gates` passed with 4 files and 7 tests.
- May 15, 2026: `pnpm verify:expanded-eval` passed with 11 files and 19 tests.
- `S40-3` is done: the next candidate is a single shadow index-data experiment for the Basalt vs Slag / Asphalt / Coal boundary, with no production threshold or UI behavior change.
- `S40-4` is done for Shadow Candidate 1: the candidate adds one non-rock Slag boundary neighbor and is classified unsafe to promote because it flips the known low-margin Basalt fixture to a non-rock Top-1 result.
- May 15, 2026: `pnpm verify:release-builds` passed after a clean dependency-store rebuild and Android emulator restart; iOS/Android bundle exports and native builds were green.

## Sprint Decision
- Do not promote Shadow Candidate 1.
- Do not retune thresholds.
- Move next to Sprint 41: create a small paired dark-boundary labeled evidence pack before testing another index candidate.

## Guardrails
- Keep beta QA paused until this detection boundary has a clearer trust readout.
- Favor uncertainty over confident wrong labels.
- Treat the first friend-facing question as: "Can RockID avoid overclaiming on dark confusers?"

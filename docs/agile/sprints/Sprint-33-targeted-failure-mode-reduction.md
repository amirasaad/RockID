# Sprint 33 — Targeted Failure-Mode Reduction

## Goal
Use Sprint 32 confusion evidence to reduce top 2–3 failure clusters with one bounded analyzer rule change.

## Stories
| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S33-1` | As the team, we choose top failure clusters by evidence. | Sprint starts with top confusions extracted from prior gate report. | Must |
| `S33-2` | As the team, we add high-signal fixtures for each selected cluster. | Each selected cluster gets a small fixture slice with explicit expected labels. | Must |
| `S33-3` | As the team, we ship only safe improvements. | Non-rock gate and no-regression gate both pass after one bounded analyzer change. | Must |

## Status
- `S33-1` Completed on `sprint/32-strong-detection-arc` (failure-cluster selection + brief pipeline).
- `S33-2` Completed on `sprint/32-strong-detection-arc` (fixture-slice generator wired into `verify:failure-clusters`).
- `S33-3` Completed on `sprint/32-strong-detection-arc` (single bounded non-rock proximity guardrail change + passing detection/no-regression gates).

## Planned Implementation Constraints
- One hypothesis, one bounded model/analyzer variable change.
- No multi-variable threshold tuning in the same sprint.
- Release gate and detection gate must both pass before merge.

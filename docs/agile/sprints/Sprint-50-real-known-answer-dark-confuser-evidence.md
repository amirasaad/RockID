# Sprint 50 - Real Known-Answer Dark-Confuser Evidence

## Goal
Capture one real known-answer dark-confuser photo candidate and record enough evidence to decide the next detection move without tuning prematurely.

## Stories
| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S50-1` | As the team, we define the candidate intake contract. | The sprint documents required fields: expected answer, source, photo conditions, app result, confidence band, alternatives, and usefulness note. | Must |
| `S50-2` | As the team, we capture one real known-answer dark-confuser candidate. | Candidate is a real photo or real sample capture, not a synthetic row, and its expected non-rock or rock-adjacent answer is known before analysis. | Must |
| `S50-3` | As the team, we classify the result before changing behavior. | Evidence states whether the app was useful, uncertain, confidently wrong, or a non-rock false positive. | Must |
| `S50-4` | As the team, we choose the next tiny detection action. | Decision is one of: add fixture only, run shadow readout, propose one bounded analyzer/index change, or stop and collect another candidate. | Should |

## Candidate Intake Contract
- `candidateId`: Stable short ID for the sample.
- `expectedAnswer`: Known answer before running the app, including whether it is rock, non-rock, or ambiguous rock-adjacent material.
- `source`: Who captured/provided it and why we trust the expected answer.
- `photoConditions`: Lighting, background, distance, wet/dry state, and any obvious confusers.
- `appResult`: `topMatch`, alternatives, confidence band, and uncertainty copy observed in the app.
- `usefulnessNote`: Whether the result would help a real tester or mislead them.
- `decision`: Fixture-only, shadow readout, bounded change proposal, or collect another candidate.

## Acceptance Gates
- No production analyzer, threshold, UI, API, index, or result-contract changes in this sprint by default.
- Candidate evidence must be real known-answer input, not another synthetic dark-boundary row.
- Any future behavior change must wait for a reproduced failure cluster or an explicitly documented one-candidate exception.
- `pnpm verify:detection-gates` must pass before merge.
- `pnpm verify:expanded-eval` must pass before merge.
- `pnpm verify:release-builds` must pass before merge to `main`.

## Evidence
- Pending: first real known-answer dark-confuser candidate evidence.
- Prior context: [Sprint 49 Dark Boundary Readout Summary](../../detection/Sprint-49-Dark-Boundary-Readout-Summary.md)

## Current Progress
- `S50-1`: Candidate intake contract drafted.
- `S50-2`: Pending real candidate capture.
- `S50-3`: Pending app result classification.
- `S50-4`: Pending decision after evidence.

## Decision
Sprint 50 starts with evidence capture only. The product bet is still honest detection progress by tiny steps: one real known-answer input, one readout, one decision.

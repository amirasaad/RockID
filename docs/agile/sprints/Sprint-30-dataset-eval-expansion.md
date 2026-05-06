# **Sprint 30: Dataset And Eval Expansion**

Sprint goal:
Improve the rock-identification quality gate by expanding labeled field fixtures and non-rock look-alikes in a curated, license-safe way.

Planning date:
2026-05-06

## **Epic Alignment**

| Epic | Milestone | Sprint Contribution |
| --- | --- | --- |
| `E9: Identification Engine Reality` | Eval coverage tracks real field risk | Add more representative classes, non-rock confusers, and ambiguous samples. |
| `E14: Dataset Quality` | Curated fixture set is reliable enough for release decisions | Document source/license/expected label/kind and review workflow. |
| `E13: Engine Feedback Loop` | Field feedback can become eval candidates | Promote reviewed feedback examples into fixtures only after curation. |

## **Sprint Stories**

| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S30-1` | As the team, eval coverage shows class and kind gaps. | Eval report highlights missing/low-coverage classes and non-rock types. | Must |
| `S30-2` | As the team, we add curated fixture candidates safely. | New fixtures include source/license/notes and do not use unreviewed user uploads as training data. | Must |
| `S30-3` | As the team, non-rock confusion risk is harder to miss. | Eval includes additional human-made materials and ambiguous look-alikes. | Must |

## **Quality Gates**

- `rock-id-eval` reports top-1, top-3, low-confidence rate, non-rock false positives, and top confusion pairs.
- New fixtures preserve or intentionally adjust confidence thresholds.
- No default analyzer flip occurs in this sprint.

## **Tracking**

| Story | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `S30-1` | `Backlog` | TBD | Use S29 feedback summary if available. |
| `S30-2` | `Backlog` | TBD | Keep license-safe. |
| `S30-3` | `Backlog` | TBD | Focus on false positive safety. |

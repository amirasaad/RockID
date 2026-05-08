# Friends Beta — Daily Triage Runbook

Last updated: May 8, 2026

## Daily Rhythm (15-20 min)
1. Review new issues.
2. Validate template completeness.
3. Apply labels and priority.
4. Assign milestone.
5. Mark owner and next action.

## Labeling Rules
- Category (required): `beta-bug`, `beta-ux`, `beta-wrong-result`, or `beta-install`
- Priority (required): `beta-priority-high` or deferred priority
- Optional status: `beta-needs-repro`, `beta-fixed`

## Resolve Policy
- `beta-priority-high`:
  - Fix in current wave or explicitly defer with reason.
- Non-high:
  - Batch for next wave unless severe trend appears.

## Wrong-Result Triage Notes
- Cross-check with:
  - expected confidence policy behavior
  - Sprint 33/34 known confusion clusters and non-rock boundaries
- If reproducible and high-impact:
  - classify as `beta-priority-high`

## SLA
- 100% of incoming reports triaged within 24h.

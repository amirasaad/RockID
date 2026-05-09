# Sprint 35 — Friends Beta Wave 1 Launch

## Goal
Launch Android Friends Beta Wave 1 with GitHub-only feedback intake, offline-first app testing, and daily triage.

## Stories
| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S35-1` | As the team, Android friends beta is ready to invite testers. | Android EAS preview build is linked in beta docs, iOS TestFlight is explicitly deferred, and tester scope remains offline-only. | Must |
| `S35-2` | As a tester, I can report useful feedback through GitHub. | Issue templates, labels, milestone, and screenshot-upload access are validated with one closed test issue per template. | Must |
| `S35-3` | As the team, daily beta triage is operational. | New issues receive category + priority labels, Wave 1 milestone ownership, and a next action within 24h. | Must |
| `S35-4` | As the team, beta learnings are easy to convert into next work. | Wave 1 issues are grouped into install, crash/blocker, UX, and wrong-result themes. | Should |

## Status
- Planned start: May 9, 2026.
- Android is the active friend beta platform.
- iOS friend distribution is deferred until Apple Developer team access exists.

## Current Evidence
- GitHub Issues enabled for `amirasaad/RockID`.
- Beta labels verified on May 9, 2026: `beta-bug`, `beta-ux`, `beta-wrong-result`, `beta-install`, `beta-priority-high`, `beta-needs-repro`, `beta-fixed`.
- Wave milestone verified: `Friends Beta Wave 1 (May 8-May 18, 2026)`.
- Closed validation issues: [#3](<https://github.com/amirasaad/RockID/issues/3>), [#4](<https://github.com/amirasaad/RockID/issues/4>), [#5](<https://github.com/amirasaad/RockID/issues/5>).

## Exit Criteria
- At least one trusted tester confirms GitHub issue access and screenshot upload.
- `pnpm verify:release-builds` passes before any beta/release-worthy merge.
- Friends can complete first scan, save/reopen, reanalyze, and issue submission missions.
- All incoming Wave 1 issues are triaged within 24h.

## Evidence To Capture
- Android EAS preview build link and build identifier.
- Closed test issues for Wrong Result, Bug / Crash, and UX Friction templates.
- Daily triage notes or issue labels showing category, priority, milestone, and next action.
- Product smoke notes for offline scan, low-confidence messaging, save/reopen, and reanalyze.

## Guardrails
- No backend telemetry or product API changes in this sprint.
- Do not tune detection thresholds from anecdote alone.
- Promote wrong-result feedback into eval work only after reproduction or clear issue detail.

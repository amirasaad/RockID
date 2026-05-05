# **Rock ID Agile Delivery Plan**

This is the lightweight delivery hub for Rock ID. It keeps process rules, sprint navigation, and current next action in one easy place while detailed sprint history lives in split files under [agile/sprints](<agile/sprints>).

Driver handoff and day-to-day engineering execution standards live in [NextDriverDevGuide.md](<NextDriverDevGuide.md>).

## **Navigation**

| Area | Purpose | Link |
| --- | --- | --- |
| Agile workspace | Sprint board, sprint index, and working agreement | [agile/README.md](<agile/README.md>) |
| Epic milestones | Jira-style epic progress and milestone map | [agile/EpicMilestones.md](<agile/EpicMilestones.md>) |
| Live Kanban | Current backlog / ready / in-progress / review / done board | [Kanban.md](<Kanban.md>) |
| Sprint files | Full sprint stories, DoD evidence, QA logs, retros | [agile/sprints](<agile/sprints>) |

## **Delivery Model**

- Cadence: 1-week sprints during MVP discovery and buildout.
- Sprint goal format: one user-visible outcome per sprint.
- Release strategy: ship vertical slices that can be demoed in the app.
- Versioning strategy: stay in `v0.x.y` during MVP; use Commitizen-shaped history plus `pnpm bump:dry`, `pnpm bump:patch`, or `pnpm bump:minor` for tracked release bumps.
- Backlog owner: product/engineering pair, using the PRD and roadmap as source material.
- Technical quality gate: every sprint should end with typecheck passing, relevant tests passing (including e2e when it touches core flow), and a short demo path verified manually when user-facing behavior changes.
- Git integration: prefer fast-forward merges (no merge commits). Rebase story branches onto the sprint branch, then fast-forward the sprint branch into `main`.

## **Working Agreement**

### Definition Of Ready

A story is ready when:

- It has a clear user value statement.
- Acceptance criteria are testable.
- Required UI states are identified.
- Required data inputs/outputs are known.
- Dependencies are either available or explicitly mocked.
- The story can be completed within one sprint.

### Definition Of Done

A story is done when:

- The user-facing flow works in the app or is explicitly marked as a non-UI slice.
- Edge states from the story are handled.
- `pnpm run typecheck` passes.
- Relevant tests pass.
- Manual validation steps are documented in sprint notes when user-facing behavior changes.
- Any version bump is intentional and keeps MVP in the `v0.x.y` line.
- Any dependency change is justified and reflected in the lockfile.
- The implementation avoids conflicting with MVP requirements in [Screen-By-ScreenRequirements.md](<Screen-By-ScreenRequirements.md>).

## **Sprint Index**

| Sprint | Goal | Details |
| --- | --- | --- |
| Sprint 1 | Real Photo Input | [Sprint-01](<agile/sprints/Sprint-01-real-photo-input.md>) |
| Sprint 2 | Result And Session State | [Sprint-02](<agile/sprints/Sprint-02-result-and-session-state.md>) |
| Sprint 3 | Saved Finds | [Sprint-03](<agile/sprints/Sprint-03-saved-finds.md>) |
| Sprint 4 | MVP Hardening | [Sprint-04](<agile/sprints/Sprint-04-mvp-hardening.md>) |
| Sprint 5 | Saved Finds Persistence | [Sprint-05](<agile/sprints/Sprint-05-saved-finds-persistence.md>) |
| Sprint 6 | Home Recent Finds | [Sprint-06](<agile/sprints/Sprint-06-home-recent-finds.md>) |
| Sprint 7 | Expo Compatibility Maintenance | [Sprint-07](<agile/sprints/Sprint-07-expo-compatibility-maintenance.md>) |
| Sprint 8 | Field-Test Readiness | [Sprint-08](<agile/sprints/Sprint-08-field-test-readiness.md>) |
| Sprint 9 | Results Clarity (Low-Confidence First) | [Sprint-09](<agile/sprints/Sprint-09-results-clarity.md>) |
| Sprint 10 | Market Offer Messaging | [Sprint-10](<agile/sprints/Sprint-10-market-offer.md>) |
| Sprint 11 | Rock ID Reality Check | [Sprint-11](<agile/sprints/Sprint-11-rock-id-reality-check.md>) |
| Sprint 12 | Dataset + Eval Expansion | [Sprint-12](<agile/sprints/Sprint-12-dataset-eval-expansion.md>) |
| Sprint 13 | Embedding Pipeline | [Sprint-13](<agile/sprints/Sprint-13-embedding-pipeline.md>) |
| Sprint 14 | On-Device Inference | [Sprint-14](<agile/sprints/Sprint-14-on-device-inference.md>) |
| Sprint 15 | App Integration (Real Engine) | [Sprint-15](<agile/sprints/Sprint-15-app-integration-real-engine.md>) |
| Sprint 16 | Confidence + Analytics | [Sprint-16](<agile/sprints/Sprint-16-confidence-and-analytics.md>) |
| Sprint 17 | Saved Photos + Settings | [Sprint-17](<agile/sprints/Sprint-17-saved-photos-and-settings.md>) |
| Sprint 18 | Learn Navigation Polish | [Sprint-18](<agile/sprints/Sprint-18-learn-navigation-polish.md>) |
| Sprint 19 | Collection Search And Filters | [Sprint-19](<agile/sprints/Sprint-19-collection-search-filter.md>) |

## **Current Next Action**

Sprint 19 collection search/filter is on `main`; complete release decision and QA notes, then plan Sprint 20 from [Kanban.md](<Kanban.md>) on a fresh `sprint/*` branch.

# **Next Driver Dev Guide**

This guide is the operating playbook for the next engineering driver on `Rock ID`. Use it to keep delivery consistent, test-first, and ready for safe merges.

## **Core Rules**

- Build vertical slices tied to sprint stories, not isolated code-only tasks.
- Prefer ATDD/TDD for behavior changes:
  - Red: add or update a failing acceptance/unit test.
  - Green: implement the smallest change to pass.
  - Refactor: improve readability while tests stay green.
- Keep docs and code aligned in the same PR when behavior changes.
- Merge to `main` only when story DoD criteria are met.
- Keep product/app versions in `v0.x.y` throughout MVP. Use `pnpm bump:dry` to preview, then `pnpm bump:patch` or `pnpm bump:minor` only when release criteria are met.

## **Branch Workflow**

1. Start from updated `main`.
2. Create a feature branch with clear scope, for example:
   - `feat/s1-camera-capture-atdd`
3. Keep commits small and narrative, using conventional gitmoji messages.
4. Rebase or merge from `main` before final verification.
5. Fast-forward merge to `main` when possible.

## **Merge And Continue**

Preferred merge path (fast-forward, local):

1. `git checkout main`
2. `git pull --ff-only`
3. `git merge --ff-only <your-branch>`

What happens on merge:

- On `main`, the repo runs `pnpm test:e2e` automatically via the local git `post-merge` hook.
- If `pnpm test:e2e` fails, the hook resets `main` back to the pre-merge commit and exits non-zero (treat this as a failed merge).
- On `main`, the repo runs `pnpm bump` automatically via the local git `post-merge` hook.
- If `pnpm bump` fails, the hook resets `main` back to the pre-merge commit and exits non-zero (treat this as a failed merge).

Continue to the next story:

1. Confirm `main` is clean: `git status`
2. Start the next branch from `main`: `git checkout -b feat/s4-<story-scope>`

If bump did not run:

- Confirm hooks are installed: run `pnpm prepare` once after cloning.
- Confirm hooks path: `git config core.hooksPath` should be `.husky/_`.
- Note: hooks only run locally; merges done on GitHub will not trigger local bump automation.

## **Story Execution Loop**

1. Pick one story from [AgileDeliveryPlan.md](<AgileDeliveryPlan.md>) tracking table.
2. Confirm acceptance criteria and edge states.
3. Write failing test(s) tied to the criteria.
4. Implement behavior.
5. Run validation commands:
   - `pnpm run test:unit`
   - `pnpm test -- __tests__/s1-gallery-upload.acceptance.test.ts` (or story-equivalent acceptance suite)
   - `pnpm run typecheck`
6. Update story status in [AgileDeliveryPlan.md](<AgileDeliveryPlan.md>) with evidence links.
7. Commit.

## **Definition Of Done Gate**

Before merge, verify all of the following:

- User-facing flow works in app for the target story.
- Edge states in acceptance criteria are handled.
- `pnpm run typecheck` passes.
- Relevant tests pass.
- Manual validation notes are captured in sprint tracking.
- Dependency changes are justified and locked (`package.json` and `pnpm-lock.yaml`).
- Version changes are intentional, stay in `v0.x.y` during MVP, and use the configured bump tooling so `package.json` plus `app.json` update together.
- No conflict with [Screen-By-ScreenRequirements.md](<Screen-By-ScreenRequirements.md>).

## **Stash And Context Handoff**

- If interrupted mid-story, stash tracked WIP with a descriptive label:
  - `git stash push -m "wip/sX-story-name"`
- Record the stash label in sprint notes when relevant.
- At handoff, share:
  - current branch
  - story status (`Done`, `Partial`, `In Progress`)
  - failing/passing test state
  - next concrete step

## **Known Local Environment Notes**

- Use `pnpm`.
- Use global Node `23.x` (enforced via `package.json` `engines`).
- Current MVP build version is tracked in `package.json`, `app.json`, and [../README.md](<../README.md>).
- Start Expo with:
  - `pnpm exec expo start --lan`
- If iOS Simulator fails, continue validation on physical iPhone via Expo Go and capture simulator issues separately.

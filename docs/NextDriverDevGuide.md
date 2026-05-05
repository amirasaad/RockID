# **Next Driver Dev Guide**

This guide is the operating playbook for the next engineering driver on `Rock ID`. Use it to keep delivery consistent, test-first, and ready for safe merges.

## **Core Rules**

- Build vertical slices tied to sprint stories, not isolated code-only tasks.
- Prefer ATDD/TDD for behavior changes:
  - Red: add or update a failing acceptance/unit test.
  - Green: implement the smallest change to pass.
  - Refactor: improve readability while tests stay green.
- For red ATDD/TDD commits, use `❌ test-fail(scope): ...`; use `✅ test-pass(scope): ...` for the first green commit after red; reserve `✨ feat(scope): ...` for user-facing behavior changes.
- Keep docs and code aligned in the same PR when behavior changes.
- Merge to `main` only when story DoD criteria are met.
- Keep product/app versions in `v0.x.y` throughout MVP. Use `pnpm bump:dry` to preview, then `pnpm bump:patch` or `pnpm bump:minor` only when release criteria are met.

## **Branch Workflow**

Sprint-based workflow (to avoid version/changelog spam):

1. Start from updated `main`.
2. Create a sprint base branch:
   - `sprint/13-core-id`
3. For each story, create a story branch from the sprint base:
   - `feat/s13-clip-knn-retrieval`
4. Merge story branches into the sprint base branch as they complete (fast-forward preferred).
5. When the sprint DoD is met, merge the sprint base branch back into `main` (fast-forward preferred).

## **Merge And Continue**

Preferred merge path (fast-forward, local):

Story merge (into sprint base):

1. `git checkout sprint/<sprint-id>`
2. `git pull --ff-only`
3. `git merge --ff-only <story-branch>`

Sprint merge (into main, release-worthy):

1. `git checkout main`
2. `git pull --ff-only`
3. `git merge --ff-only sprint/<sprint-id>`

What happens on merge:

- On `main` and `sprint/*`, the repo runs `pnpm test:e2e` automatically via the local git `post-merge` hook.
- If `pnpm test:e2e` fails, the hook resets the branch back to the pre-merge commit and exits non-zero (treat this as a failed merge).
- The repo does not auto-bump on merge; release bumps are explicit after sprint DoD.
- Run `pnpm bump:dry`, choose `pnpm bump:patch` or `pnpm bump:minor`, and confirm the generated release commit uses `🔖 bump(release): v0.x.y`.

Continue to the next story:

1. Confirm your sprint base branch is clean: `git status`
2. Start the next story branch from the sprint base: `git checkout -b feat/s<id>-<story-scope>`

Release bump reminder:

- Confirm hooks are installed: run `pnpm prepare` once after cloning.
- Confirm hooks path: `git config core.hooksPath` should be `.husky/_`.
- Hooks only run local validation; they do not publish, push tags, or cut a hosted release.

## **Story Execution Loop**

1. Pick one story from [agile/README.md](<agile/README.md>) or [agile/EpicMilestones.md](<agile/EpicMilestones.md>).
2. Confirm acceptance criteria and edge states.
3. Write failing test(s) tied to the criteria.
4. Implement behavior.
5. Run validation commands:
   - `pnpm run test:unit`
   - `pnpm test -- __tests__/s1-gallery-upload.acceptance.test.ts` (or story-equivalent acceptance suite)
   - `pnpm run typecheck`
6. Update the relevant sprint file in [agile/sprints](<agile/sprints>) and [agile/EpicMilestones.md](<agile/EpicMilestones.md>) when status changes.
7. Commit.

Commit message conventions (RockID rhythm):

- Red ATDD/TDD: `❌ test-fail(scope): cover <story behavior>`
- Green after red: `✅ test-pass(scope): make tests pass`
- Green feature implementation: `✨ feat(scope): add <user-visible behavior>`
- Passing or maintenance tests: `🧪 test(scope): update expectations`
- Refactor: `📦 refactor(scope): simplify <code shape>`
- Agile tracking: `📋 agile(s22): move story to review`
- Manual QA evidence: `✅ qa(s22): record web and iphone smoke`
- Version bump: `🔖 bump(release): v0.x.y`
- Tooling/config: `🔧 config(commit): update commit rhythm`

Use `pnpm run commit` to open the local RockID Commitizen prompt.

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
- Expo Go vs development builds:
  - Expo Go cannot load arbitrary third-party native modules.
  - Once we add on-device inference (for example `onnxruntime-react-native`), use a custom Expo development build for device testing instead of Expo Go.

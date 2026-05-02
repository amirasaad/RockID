# Rock ID

Rock ID is an Expo React Native app for beginner-friendly rock identification. It helps a user take or upload a rock photo, review image quality, add optional observations, and move through a mocked identification flow that emphasizes confidence and uncertainty.

The product is positioned as an educational field aid, not a lab-grade geological determination tool.

## Current State

Implemented:

- Expo Router app shell with Identify, Collection, Learn, and Settings tabs.
- Camera capture and photo-library upload through `expo-image-picker`.
- Permission-denied and cancelled-selection handling for camera and gallery flows.
- Review screen that displays the selected image when available.
- Observation, analyzing, results, saved-find, and learning screens backed by mock data.
- Unit tests for the photo input helpers.

Still mocked or future scope:

- Real rock identification model or backend analysis.
- Real image quality scoring beyond the current review checklist UI.
- Persistent saved collection storage.
- Multi-photo specimen support.
- Account, sync, and production data privacy flows.

## Tech Stack

- Expo `~54`
- React `19`
- React Native `0.81`
- Expo Router `~6`
- TypeScript
- Vitest
- pnpm

The project expects Node `>=23 <24`, as defined in `package.json`.

## Versioning

Current MVP build version: `v0.4.0`.

Keep the app in the `v0.x.y` line throughout MVP. Use Commitizen for conventional gitmoji commits, then use the bump scripts to derive versions from that history. Minor bumps represent sprint-level or user-visible milestone progress, patch bumps represent fixes/docs/tooling inside the current MVP milestone, and `v1.0.0` is reserved for the explicit MVP release decision after the definition of done is met.

Preview a bump without writing files:

```sh
pnpm bump:dry
```

Create an MVP bump commit and tag when release criteria are met:

```sh
pnpm bump:patch
pnpm bump:minor
```

The bump tooling updates `package.json` and `app.json` together through `.versionrc.cjs`.

Merges into `main` run `pnpm bump` automatically via git hooks. If bumping fails, the merge is reverted locally.

## Getting Started

Install dependencies:

```sh
pnpm install
```

Start the Expo dev server:

```sh
pnpm start
```

Run on a target platform:

```sh
pnpm ios
pnpm android
pnpm web
```

For device testing, the driver guide recommends:

```sh
pnpm exec expo start --lan
```

## Validation

Run all tests:

```sh
pnpm test
```

Run the focused photo input unit tests:

```sh
pnpm run test:unit
```

Run TypeScript checks:

```sh
pnpm run typecheck
```

## Git Workflow

This repo enforces a consistent commit format using Husky hooks + Commitlint + Commitizen.

Commit with the guided prompt:

```sh
pnpm commit
```

Rules enforced on commit:

- Commit header must start with a gitmoji emoji (example: `✨ feat: add rock filter`).
- Conventional Commit structure is required after the emoji (type/scope/subject).
- Pre-commit runs `pnpm typecheck` and `pnpm test:unit`.

If hooks aren’t running after a fresh clone, run:

```sh
pnpm prepare
```

## Project Structure

```text
app/                 Expo Router screens and tab routes
components/          Shared UI components
constants/           Theme tokens
lib/                 Photo input helpers and mock data
__tests__/           Vitest unit and acceptance tests
docs/                Product, roadmap, flow, and delivery docs
assets/images/       App icons and splash assets
```

## Main User Flow

1. Open the Identify tab.
2. Choose `Take Photo` or `Upload Photo`.
3. Capture or select a rock image.
4. Review the image and quality checklist.
5. Add optional observations.
6. View mocked likely matches and confidence labels.
7. Save, compare, retake, or continue learning from the result.

## Key Docs

- `docs/PRD.md` defines product goals, target users, MVP scope, and trust requirements.
- `docs/Screen-By-ScreenRequirements.md` details expected UI, states, analytics, and actions by screen.
- `docs/ClickableFlowMap.md` maps the end-to-end user flow.
- `docs/AgileDeliveryPlan.md` is the agile delivery hub and current-next-action pointer.
- `docs/agile/README.md` indexes sprint files and epic milestone tracking.
- `docs/Kanban.md` is the live board for what is backlog, ready, in progress, review, and done.
- `docs/NextDriverDevGuide.md` documents the engineering workflow and validation gate.

## Engineering Notes

- Keep code and docs aligned when behavior changes.
- Prefer vertical slices tied to sprint stories.
- Use ATDD/TDD for behavior changes where practical.
- Keep user-facing language clear about uncertainty; photo-only rock identification has limits.
- Do not present mocked results as real model output.

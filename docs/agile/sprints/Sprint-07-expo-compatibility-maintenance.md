# **Sprint 7: Expo Compatibility Maintenance**

Sprint goal:
Remove Expo compatibility warnings that could destabilize web or iPhone validation.

Stories:

| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S7-1` | As the team, we can align `react-native-worklets` with the installed Expo SDK so local runs stop warning about incompatible package versions. | `react-native-worklets` matches Expo's expected version; lockfile is updated; `pnpm run typecheck` and `pnpm test` pass. | Must |

## **Sprint 7 Tracking**

Story status snapshot:

| Story | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `S7-1` | `Done` | [package.json](<../../../package.json>) and [pnpm-lock.yaml](<../../../pnpm-lock.yaml>) | `react-native-worklets` aligned from `0.8.1` to Expo-expected `0.5.1`; Expo dependency check reports dependencies are up to date using local map |

Definition of done checkpoint (`S7-1`):

| DoD Criterion | Current State |
| --- | --- |
| Expo compatibility warning resolved | `Yes` - `pnpm exec expo install --check` reports dependencies are up to date using the local dependency map |
| `react-native-worklets` version aligned | `Yes` - `0.5.1` in `package.json` and `pnpm-lock.yaml` |
| `pnpm run typecheck` passes | `Yes` |
| Relevant tests pass | `Yes` - `pnpm test` passes |
| Manual validation documented | `N/A for dependency-only slice`; automated compatibility and test checks recorded |
| MVP version remains in `v0.x.y` | `Yes` |
| Dependency changes justified and locked | `Yes` |
| No MVP requirement conflicts | `Yes` |

Manual QA log (`S7-1`):

- Date: 2026-05-02
- Scope: Expo compatibility for `react-native-worklets`
- Validation type: Automated dependency check, typecheck, and tests
- `pnpm exec expo install --check`: `Pass` using local dependency map in offline mode
- `pnpm run typecheck`: `Pass`
- `pnpm test`: `Pass`
- Notes / follow-up fixes: None

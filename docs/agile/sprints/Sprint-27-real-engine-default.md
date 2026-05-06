# **Sprint 27: Real Engine Default Enablement**

Sprint goal:
Enable the on-device CLIP kNN engine as the default analyzer after Sprint 26 hardening met all quality gates.

Planning date:
2026-05-06

## **Why This Sprint Exists**

Sprint 26 calibrated confidence thresholds, hardened non-rock detection, and expanded fixtures with edge cases. All quality gates passed (zero high-confidence non-rock mistakes, top-3 accuracy >= 0.9 on field QA set). The real engine is now safe to become the default.

## **Sprint Stories**

| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S27-1` | As a user, the app uses the real engine by default without manual configuration. | `getConfiguredAnalyzerKind()` returns `'onDeviceClipKnn'` when no env override is set; `'mock'` remains available as an explicit override. | Must |
| `S27-2` | As the team, all E2E tests pass with the real engine as default. | `pnpm test:e2e` passes (4 specs); no regressions from Sprint 26 baseline. | Must |
| `S27-3` | As the team, the default analyzer kind is protected against accidental regression. | A dedicated test asserts the default is `'onDeviceClipKnn'`; CI fails if the default is changed without intent. | Should |

## **Quality Gates**

| Metric | Gate |
| --- | --- |
| E2E test pass rate | 4/4 specs passing |
| Default analyzer kind | `'onDeviceClipKnn'` (verified by test) |
| Non-rock false positive rate | Zero on expanded fixture set (inherited from S26) |
| Top-3 accuracy on field QA set | >= Sprint 26 baseline (>= 0.9) |
| Version bump | `v0.27.0` (minor bump for user-visible change) |

## **Definition Of Done Checkpoint**

| DoD Criterion | Target State |
| --- | --- |
| Real engine is the default | `Yes` |
| All E2E tests pass | `Yes` |
| Regression test for default exists | `Yes` |
| Sprint 26 quality gates still pass | `Yes` |
| Relevant tests pass | `Yes: typecheck, full Vitest, Playwright E2E` |

## **Sprint 27 Tracking**

| Story | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `S27-1` | `Done` | [analyzer-kind.ts](<../../../lib/analyzer-kind.ts>), [s27-default-analyzer-kind.test.ts](<../../../__tests__/s27-default-analyzer-kind.test.ts>) | Changed default from `'mock'` to `'onDeviceClipKnn'` in `getConfiguredAnalyzerKind()` |
| `S27-2` | `Done` | E2E spec results | All 4 E2E tests pass with real engine default |
| `S27-3` | `Done` | [s27-default-analyzer-kind.test.ts](<../../../__tests__/s27-default-analyzer-kind.test.ts>) | 4 assertions covering default and override paths |

## **Technical Changes**

### Default Analyzer Kind Change
- **File:** `lib/analyzer-kind.ts`
- **Change:** Update fallback from `'mock'` to `'onDeviceClipKnn'` in `getConfiguredAnalyzerKind()`
- **Before:** `return 'mock';`
- **After:** `return 'onDeviceClipKnn';`
- **Rationale:** Sprint 26 hardening met all quality gates; real engine is now production-ready

### Default Analyzer Kind Regression Test
- **File:** `__tests__/s27-default-analyzer-kind.test.ts`
- **Change:** New test asserting `getConfiguredAnalyzerKind()` returns `'onDeviceClipKnn'` with no overrides

## **QA Matrix**

| Area | Scenario | Evidence | Status |
| --- | --- | --- | --- |
| Static quality | TypeScript compile gate | `pnpm run typecheck` | `Pass` |
| Default enablement | Real engine is default | `s27-default-analyzer-kind.test.ts` (4/4) | `Pass` |
| E2E regression | Core flows stable with real engine default | `pnpm test:e2e` (4/4) | `Pass` |

## **Next Technical Move**

- Sprint 28: Post-launch monitoring and user feedback collection on real engine behavior
- Or: Additional tuning if field reports reveal edge cases not covered by current fixtures

## **Release Closeout**

- Branch: `sprint/27-real-engine-default`
- Story branch: `feat/s27-real-engine-default`
- Sprint merge: `git merge --ff-only feat/s27-real-engine-default`
- Main merge: `git merge --ff-only sprint/27-real-engine-default`
- Release target: `v0.27.0`

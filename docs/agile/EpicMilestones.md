# **Epic Milestones**

This file tracks MVP epic progress in a Jira-like shape: epic, milestone, linked sprint evidence, and next useful slice. Product sequencing still lives in [../Roadmap.md](<../Roadmap.md>); this file tracks delivery state.

## **MVP Epic Board**

| Epic | Milestone | Status | Evidence | Next Slice |
| --- | --- | --- | --- | --- |
| `E1: Capture Input` | Users can take or upload a real rock photo | `Done` | [Sprint 1](<sprints/Sprint-01-real-photo-input.md>) | Field-test camera/upload edge cases as issues appear |
| `E2: Image Review` | Users can review photo and quality hints before analysis | `Done` | [Sprint 1](<sprints/Sprint-01-real-photo-input.md>), [Sprint 4](<sprints/Sprint-04-mvp-hardening.md>) | Improve quality scoring when real image analysis exists |
| `E3: Observations` | Users can add optional field clues | `Done` | [Sprint 2](<sprints/Sprint-02-result-and-session-state.md>) | Add richer field tests after MVP loop is stable |
| `E4: Mock Identification` | Users receive top 3 matches with confidence and uncertainty copy | `Done` | [Sprint 2](<sprints/Sprint-02-result-and-session-state.md>) | Replace typed mock service with real model/backend later |
| `E5: Saved Finds` | Users can save, persist, reopen, search, filter, delete, and see recent finds | `Done` | [Sprint 3](<sprints/Sprint-03-saved-finds.md>), [Sprint 5](<sprints/Sprint-05-saved-finds-persistence.md>), [Sprint 6](<sprints/Sprint-06-home-recent-finds.md>), [Sprint 17](<sprints/Sprint-17-saved-photos-and-settings.md>), [Sprint 19](<sprints/Sprint-19-collection-search-filter.md>) | Consider export/share only after MVP loop is calm |
| `E6: Learning Content` | Users can browse beginner learning topics | `Done` | [Sprint 4](<sprints/Sprint-04-mvp-hardening.md>), [Sprint 18](<sprints/Sprint-18-learn-navigation-polish.md>) | Replace placeholder content with richer topic pages |
| `E7: Platform Readiness` | Dependencies and local app runtime stay compatible | `In Progress` | [Sprint 7](<sprints/Sprint-07-expo-compatibility-maintenance.md>), [Sprint 14](<sprints/Sprint-14-on-device-inference.md>) | Continue resolving Expo/runtime warnings as they surface |
| `E8: Field-Test Learning` | MVP field testing produces actionable usefulness and trust signals | `Done` | [Sprint 8](<sprints/Sprint-08-field-test-readiness.md>), [Sprint 9](<sprints/Sprint-09-results-clarity.md>) | Gather trends from feedback to choose Sprint 10 focus |
| `E9: Identification Engine Reality` | The team can measure whether rock identification works before integrating a real model | `Done` | [Sprint 11](<sprints/Sprint-11-rock-id-reality-check.md>) | Use findings to harden non-rock detection and expand the labeled fixture |
| `E10: On-Device Inference` | The app can compute image embeddings on device with safe fallback | `Done` | [Sprint 14](<sprints/Sprint-14-on-device-inference.md>) | Replace smoke-test model with production embedding model when ready |
| `E11: Real Engine Integration` | The app can run a real analyzer behind a feature flag | `Done` | [Sprint 13](<sprints/Sprint-13-embedding-pipeline.md>), [Sprint 15](<sprints/Sprint-15-app-integration-real-engine.md>), [Sprint 16](<sprints/Sprint-16-confidence-and-analytics.md>) | Expand eval + guardrails before enabling by default |

## **Milestone Health**

| Milestone | Status | Notes |
| --- | --- | --- |
| `MVP local loop` | `Done` | Capture → review → observations → results → save → collection → detail works locally. |
| `Persistence` | `Done` | Saved finds persist across app restart on iPhone; saved photos are durable when local save is enabled. |
| `Home revisit loop` | `Done` | Home Recent Finds verified on web and iPhone. |
| `Compatibility hygiene` | `In Progress` | Worklets warning resolved; keep watching Expo checks. |
| `Field-test readiness` | `Done` | Result usefulness feedback shipped; validated on web and iPhone with e2e coverage. |
| `Low-confidence clarity` | `Done` | Low-confidence-first Results variant validated on web and iPhone, with passing e2e and unit coverage. |
| `Rock-ID reality check` | `Done` | Starter eval reports top-1/top-3 accuracy, uncertainty, non-rock false positives, and confusion pairs. |
| `Confidence policy` | `Done` | Confidence thresholds are explicit and conservative-by-default for kNN retrieval. |
| `Analytics policy` | `Done` | Analytics remains local-first; optional local event log exists behind a dev flag. |

## **Epic Update Rules**

- Mark an epic `Done` only when user-facing DoD is documented in sprint evidence.
- Mark an epic `In Progress` when at least one sprint story is active but follow-up slices remain.
- Keep `Next Slice` short and actionable, not a wishlist.

# **Sprint 10: Market Offer Messaging (Home, Capture Tips, Results)**

Sprint goal:
Make the in-flow value proposition and trust posture clear without relying on onboarding screens, by placing “market offer” messaging on `Home / Identify`, `Capture Tips`, and `Results` (including low-confidence trust copy).

Planning date:
2026-05-02

## **Spec Alignment**

Primary spec source:

- [Screen-By-ScreenRequirements.md](<../../Screen-By-ScreenRequirements.md>) sections:
  - `3. Home / Identify`
  - `4. Capture Tips`
  - `9. Results`
  - `10. Low-Confidence Variant`

Messaging pillars for this sprint:

- Clear promise: `Identify rocks from a photo`
- Honest framing: confidence levels are explicit; low-confidence cases emphasize next steps
- Practical value: field tips improve photo quality and user outcomes
- No “prototype” disclaimers in user-facing UI (remove “mocked data” messaging from Results)

Out of scope:

- Welcome / onboarding flows
- Permission intro screens or permission-routing changes
- Any new account, subscription, or paywall work

## **Sprint Stories**

| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S10-1` | As a user, I see a clear market offer message on `Home / Identify` so I know what the app does before starting. | `Home / Identify` includes a short value-prop message near the primary CTA that matches the core promise (`Identify rocks from a photo`) and sets expectation that results include confidence and field tips; existing CTAs `Take Photo` and `Upload Photo` remain unchanged; no onboarding/permission screens are introduced. | Must |
| `S10-2` | As a user, I see “why tips matter” messaging on `Capture Tips` so I understand the benefit of taking a better photo. | `Capture Tips` keeps title `Before You Snap` and the tip list from the spec; add/adjust a short subtitle/body line that links photo quality to clearer results (confidence + next steps) without implying lab-grade certainty; analytics `capture_tips_viewed` and `capture_tips_open_camera` still fire. | Must |
| `S10-3` | As a user, `Results` focuses on the outcome and confidence (not implementation details). | `Results` screen does not show any subtitle/copy that states the data is mocked or a prototype; confidence remains above the fold per spec; existing sections remain: `Why this match`, `Other likely matches`, `Look-alikes`, `Check next`. | Must |
| `S10-4` | As a user, low-confidence results preserve trust with clear, actionable copy. | When confidence is low, show a `Low confidence` banner and trust message that explicitly states one photo may not be enough and recommends adding another photo before saving; primary action `Add Another Photo` routes to `Capture Tips`; analytics `low_confidence_result_viewed` and `low_confidence_add_photo_tapped` fire. | Must |
| `S10-5` | As the product team, we can validate the offer messaging changes with automated coverage. | Add/update at least one automated test that asserts: `Home / Identify` contains the market offer message, `Capture Tips` contains “why tips matter” messaging, and `Results` does not contain “mocked data” subtitle text; test is resilient to layout-only changes. | Should |

## **Acceptance Test Starter**

Start with the smallest failing test that proves the user-facing offer copy is present and the Results disclaimer is gone.

Candidate acceptance test:

- Given the user opens `Home / Identify`
- Then the market offer message (`Identify rocks from a photo`) is visible
- When the user navigates to `Capture Tips`
- Then the “why tips matter” message is visible
- When the user navigates to `Results`
- Then Results does not display any “mocked data” subtitle

## **Definition Of Done Checkpoint**

| DoD Criterion | Target State |
| --- | --- |
| Home/Identify shows market offer message near CTAs | `Yes` |
| Capture Tips includes “why tips matter” message | `Yes` |
| Results removes “mocked data” subtitle | `Yes` |
| Low-confidence trust copy is explicit + actionable | `Yes` |
| `pnpm run typecheck` passes | `Yes` |
| Relevant tests pass | `Yes` |
| Manual validation documented | `Yes` |
| No MVP requirement conflicts | `Yes` |

## **Manual QA Plan**

- Web:
  - Home shows market offer message without adding onboarding steps.
  - Capture Tips shows “why tips matter” message; `Open Camera` still works.
  - Results shows no “mocked data” subtitle; confidence remains above fold.
  - Low-confidence Results show the trust message and `Add Another Photo` routes to Capture Tips.
- iPhone:
  - Repeat the same copy + routing checks.
  - Confirm no new permission prompts or onboarding flows were introduced.

## **Sprint Risks**

- Copy churn: keep strings scoped to the approved promise + trust posture to avoid rework.
- Trust regression: avoid implying certainty; keep low-confidence guidance explicit and actionable.
- Test brittleness: assert specific copy snippets, not layout hierarchy.

## **Sprint 10 Tracking**

Story status snapshot:

| Story | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `S10-1` | `Planned` | This sprint plan | Offer message is placed on `Home / Identify` instead of onboarding |
| `S10-2` | `Planned` | This sprint plan | Capture Tips links photo quality to clearer results without overclaiming |
| `S10-3` | `Planned` | This sprint plan | Results removes user-facing “mocked data” messaging |
| `S10-4` | `Planned` | This sprint plan | Low-confidence trust copy matches spec intent and routes to Capture Tips |
| `S10-5` | `Planned` | This sprint plan | Automated coverage asserts copy presence/absence in key screens |

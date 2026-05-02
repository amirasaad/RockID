# **Sprint 4: MVP Hardening**

Sprint goal:
Prepare the prototype for first field-style testing.

Stories:

| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S4-1` | As a user, I can see basic image quality hints before analysis so I know whether to retake the photo. | Review screen derives `Sharpness`, `Lighting`, and `Framing` labels from available photo metadata; missing photo shows `Unknown` labels; a single actionable tip is shown. | Must |
| `S4-2` | As the team, we can stub analytics event tracking so we can wire product metrics without committing to a vendor. | A small analytics wrapper exists; it is no-op by default and testable via an injected sink; event names align with Screen-By-Screen requirements. | Should |
| `S4-3` | As a user, I can browse beginner rock learning topics so I can build confidence in what the results mean. | Learn tab lists MVP topics and is ready for topic detail routing; baseline `learn_tab_viewed` analytics fires on open. | Should |

## **Sprint 4 Tracking**

Story status snapshot:

| Story | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `S4-1` | `Done` | [app/review.tsx](<../../../app/review.tsx>), [lib/image-quality.ts](<../../../lib/image-quality.ts>), and [__tests__/s4-image-quality.test.ts](<../../../__tests__/s4-image-quality.test.ts>) | Review now shows basic quality hints and a single tip using local metadata only |
| `S4-2` | `Done` | [lib/analytics.ts](<../../../lib/analytics.ts>), [__tests__/s4-analytics.acceptance.test.ts](<../../../__tests__/s4-analytics.acceptance.test.ts>), and [app/(tabs)/index.tsx](<../../../app/(tabs)/index.tsx>) | Analytics wrapper exists and key screens emit baseline events without binding to a vendor |
| `S4-3` | `Done` | [app/(tabs)/learn.tsx](<../../../app/(tabs)/learn.tsx>), [app/(tabs)/learn/[slug].tsx](<../../../app/(tabs)/learn/[slug].tsx>), and [__tests__/s4-learn-topics.acceptance.test.ts](<../../../__tests__/s4-learn-topics.acceptance.test.ts>) | Learn topics now navigate into a placeholder detail screen and emit `learn_topic_opened` analytics |

## **Sprint 4 Retro (Mid-Sprint)**

What went well:

- Following ATDD for most changes kept us focused on user-visible outcomes.

What went wrong / needs improvement:

- Poor unit-level TDD discipline: we sometimes implemented first and tested later.
- Missing the consistent rhythm of test-fail → test-pass (and the narrative in commits).
- Automated QA coverage is not true end-to-end yet; some navigation/UI issues still require manual discovery.

Action items:

- Default to red → green → refactor for each change, even for “small” fixes.
- Prefer unit tests for pure logic (view models, actions, mapping functions) before wiring UI.
- Add a proper E2E smoke path for the core flow (Identify → Review → Observations → Results → Save → Collection → Saved Detail).


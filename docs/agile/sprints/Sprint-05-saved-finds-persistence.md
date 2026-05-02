# **Sprint 5: Saved Finds Persistence**

Sprint goal:
Persist saved finds across app restarts on the same device.

Stories:

| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S5-1` | As a user, my saved finds persist across app restarts so I do not lose my collection. | Saved finds are stored locally; after app restart, Collection shows previously saved finds and Saved Find detail opens without "could not be loaded". | Must |
| `S5-2` | As a user, I can delete a saved find so I can keep my collection clean. | Delete action removes a saved find; Collection updates; opening a deleted id shows a recovery state. | Should |

## **Sprint 5 Tracking**

Story status snapshot:

| Story | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `S5-1` | `Done` | [lib/saved-finds-context.tsx](<../../../lib/saved-finds-context.tsx>), [lib/saved-finds-persistence.ts](<../../../lib/saved-finds-persistence.ts>), and [__tests__/s5-saved-finds-context-persistence.test.ts](<../../../__tests__/s5-saved-finds-context-persistence.test.ts>) | On-device restart QA passed on iPhone: after force quit + reopen, `Collection` still shows saved finds and Saved Find detail opens normally |
| `S5-2` | `Done` | [app/saved/[id].tsx](<../../../app/saved/[id].tsx>), [lib/saved-finds.ts](<../../../lib/saved-finds.ts>), and [__tests__/s3-saved-find-store.test.ts](<../../../__tests__/s3-saved-find-store.test.ts>) | Saved Find detail includes a delete action; deletion removes the record, updates Collection, and opening a deleted id shows the recovery state |

Manual QA log (`Sprint 5`):

- Date: 2026-05-02
- Scope: `S5-1` saved finds persistence across app restart
- Device/OS: iPhone (iOS)
- Tester: Amir
- Steps: Save a result → force quit app → reopen → confirm `Collection` still shows saved find → open saved find detail
- Result: Pass
- Notes / follow-up fixes: None

## **Sprint 5 Retro (Quick)**

What went well:

- Kept the red → green rhythm and commit narrative (failing test → test-pass → refactor).

What to improve:

- Acceptance-test commits used `test:` which meant release bump tooling didn’t “see” early feature work.

Action:

- For ATDD acceptance tests tied to user-visible stories, use `feat:` commit type going forward (keep 🧪 emoji if it’s primarily test code).

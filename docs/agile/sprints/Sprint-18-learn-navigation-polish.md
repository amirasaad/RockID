# **Sprint 18: Learn Navigation Polish**

Sprint goal:
Make Learn feel like a real tab with search and human-friendly topic titles.

Planning date:
2026-05-05

## **Sprint Stories**

| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S18-1` | As a user, I can quickly find learning topics. | Learn tab has search input, filters topics, and tracks `learn_search_used`. | Must |
| `S18-2` | As a user, topic pages show readable titles. | Topic screen subtitle shows the topic title (not the raw slug). | Must |

## **Sprint 18 Tracking**

| Story | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `S18-1` | `Done` | [learn.tsx](<../../../app/(tabs)/learn.tsx>) | Search filters the topic list and tracks once per query value. |
| `S18-2` | `Done` | [learn/[slug].tsx](<../../../app/(tabs)/learn/[slug].tsx>) | Topic title is resolved from the canonical learn topic list. |


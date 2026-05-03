# **Live Kanban**

Update policy:

- Treat this board as the live what-is-next view for product, engineering, QA, and stakeholder handoff.
- Update after each merge to `main` and after each sprint planning / demo.
- Keep completed details in sprint files under [agile/sprints](<agile/sprints>).
- Workflow note: prefer story branches merged into a `sprint/*` base branch, then merge the sprint branch into `main` at DoD.

| Backlog | Ready | In Progress | Review | Done |
| --- | --- | --- | --- | --- |
| `[ENG]` Consider Collection search/filter polish after MVP loop stabilizes <br> `[PO]` Decide when to replace local feedback with analytics/backend events <br> `[ENG]` Sprint 14: on-device inference (dev build + ONNX Runtime) once embedding pipeline is stable <br> `[ENG]` Sprint 15: app integration behind feature flag once eval gates are met | `[ENG]` Sprint 13: embedding pipeline (offline script + demo index artifact, license-safe) <br> `[ENG]` Define confidence thresholds from retrieval scores (conservative by default, calibrate later) | `[ENG]` Sprint 13: move from synthetic embedder to real embedding artifacts (still offline-first, no ONNX yet) | `None` | `[ENG]` Sprint 6 Home Recent Finds merged and released `v0.8.0` <br> `[ENG]` Sprint 7 Expo worklets compatibility merged and released `v0.8.1` <br> `[PO/ENG]` Sprint 8 planning completed <br> `[ENG/QA]` Sprint 8 result usefulness feedback validated on web and iPhone <br> `[ENG/QA]` Sprint 9 low-confidence clarity validated on web and iPhone <br> `[ENG]` Sprint 11 rock-ID reality check identified non-rock false-positive risk <br> `[ENG]` Sprint 12 dataset + eval expansion (coverage/per-class/non-rock confusions) merged <br> `[ENG]` Sprint 13 CLIP kNN foundations: cosine ranking + retrieval gate + analyzer adapter + eval acceptance (synthetic embedder) merged |

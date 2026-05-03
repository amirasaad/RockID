# **Sprint 13: Embedding Pipeline + Demo Vector Index (Cost-Free)**

Sprint goal:
Create a reproducible offline embedding pipeline and a tiny checked-in demo vector index so we can validate CLIP kNN retrieval deterministically before integrating on-device inference.

Planning date:
2026-05-03

## **Why This Sprint Exists**

Before we add native inference (ONNX Runtime + development builds), we want to prove the retrieval approach works end-to-end: reference embeddings + cosine similarity + top-3 matches + conservative confidence rules. Sprint 13 builds the “data + math” foundation without coupling to device runtime complexity.

## **Sprint Stories**

| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S13-1` | As the team, we can generate embeddings for curated reference images offline with no paid APIs. | Provide a script that takes a curated image set and outputs a JSON (or equivalent) vector index artifact containing `id`, `label`, `kind`, and `embedding`. | Must |
| `S13-2` | As a developer, cosine similarity ranking is deterministic and testable. | Unit tests cover normalization, cosine ranking, top-3 retrieval, and empty/invalid index handling. | Must |
| `S13-3` | As the product/engineering pair, we can ship a tiny demo index in-repo without violating licensing. | A small demo index is checked in; raw images are included only when license permits, otherwise only embeddings + metadata are checked in. | Must |
| `S13-4` | As the team, we can run an acceptance test that proves retrieval returns the expected top 3 for a fixed embedding fixture. | Add a non-UI acceptance test that uses a fixed query embedding and reference index to assert the expected top 3 labels and confidence band behavior. | Should |

## **Dataset Policy (Sprint 13)**

- Each reference item should carry metadata: `id`, `label`, `kind` (`rock`/`non-rock`), `group`, `source`, `license`, and optional notes.
- Community uploads are not training data by default; they enter as review candidates until curated.

## **Definition Of Done Checkpoint**

| DoD Criterion | Target State |
| --- | --- |
| Offline embedding script exists and is documented via usage examples | `Yes` |
| Deterministic cosine kNN module is unit-tested | `Yes` |
| Demo index artifact is checked in and license-safe | `Yes` |
| Acceptance test validates top-3 retrieval on fixtures | `Yes` |
| `pnpm run typecheck` passes | `Yes` |
| Relevant tests pass | `Yes` |

## **Sprint Risks**

- Licensing: avoid shipping copyrighted images; prefer public-domain/CC licensed sources or shipping embeddings only.
- Metric overfitting: ensure the acceptance fixture isn’t “too easy”; keep it small but representative.

## **Sprint 13 Tracking**

| Story | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `S13-1` | `Planned` | This sprint plan | Script produces an index artifact consumed by the app later |
| `S13-2` | `Planned` | This sprint plan | Pure math module stays independent of UI/runtime |
| `S13-3` | `Planned` | This sprint plan | Demo index is safe to ship in OSS repo |
| `S13-4` | `Planned` | This sprint plan | Locks down the retrieval contract before ONNX |


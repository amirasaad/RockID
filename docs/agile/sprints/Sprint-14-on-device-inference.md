# **Sprint 14: On-Device Inference (Dev Build + ONNX Runtime)**

Sprint goal:
Run the image embedding model on-device (no network) inside a custom Expo development build, and produce embeddings that can be used for CLIP kNN retrieval.

Planning date:
2026-05-03

## **Why This Sprint Exists**

Expo Go cannot load arbitrary third-party native libraries. A development build can include native libraries, which we need for on-device inference via ONNX Runtime for React Native.

## **Sprint Stories**

| ID | Story | Acceptance Criteria | Priority |
| --- | --- | --- | --- |
| `S14-1` | As a developer, the project supports a custom Expo development build for native inference libraries. | A dev build can be created and run locally; app boots and core navigation works. | Must |
| `S14-2` | As the app, we can load an ONNX image encoder and produce an embedding for a selected photo URI. | `identifyRockPhotoOnDevice(photoUri)` (or equivalent) returns a normalized embedding vector without network access. | Must |
| `S14-3` | As a user, inference failures are recoverable and do not break the app flow. | Model/index load failures surface a user-safe error state or a safe fallback path in dev; no crash loops. | Must |
| `S14-4` | As the team, we can measure whether on-device inference is acceptable for an MVP demo. | Record rough latency and memory observations in the sprint closeout (target: no crash, reasonable latency). | Should |

## **Definition Of Done Checkpoint**

| DoD Criterion | Target State |
| --- | --- |
| Dev build works on iPhone for the project | `Yes` |
| ONNX model loads and runs locally with no network | `Yes` |
| Embedding output is normalized and stable for the same input | `Yes` |
| Failure paths are safe and recoverable | `Yes` |
| `pnpm run typecheck` passes | `Yes` |
| Relevant tests pass | `Yes` |

## **Sprint Risks**

- Model export: exporting MobileCLIP image encoder to ONNX may block progress; keep a fallback plan to use a smaller, proven ONNX image encoder temporarily.
- App bundle size: models can bloat build artifacts; keep the first model small and demo-scoped.
- Platform differences: iOS/Android performance and file access differ; validate iPhone first if that’s the MVP target.

## **Sprint 14 Tracking**

| Story | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `S14-1` | `Planned` | This sprint plan | Dev build enables native inference libs |
| `S14-2` | `Planned` | This sprint plan | Produces embedding output for retrieval |
| `S14-3` | `Planned` | This sprint plan | Failures are safe and debuggable |
| `S14-4` | `Planned` | This sprint plan | Record device observations |


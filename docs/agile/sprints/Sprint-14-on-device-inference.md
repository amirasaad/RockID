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
| `S14-1` | `In Progress` | `expo-dev-client` added + iOS pods synced | `expo run:ios --device` build succeeds but CLI attach may fail with `devicectl Error: null`; dev client works when opening the app manually and deep-linking to Metro in LAN mode |
| `S14-2` | `Partial` | [s14-photo-uri-embedder.test.ts](<../../../__tests__/s14-photo-uri-embedder.test.ts>), [s14-native-onnx-wiring.test.ts](<../../../__tests__/s14-native-onnx-wiring.test.ts>), [s14-on-device-image-encoder.test.ts](<../../../__tests__/s14-on-device-image-encoder.test.ts>), [s14-photo-based-analysis.acceptance.test.ts](<../../../__tests__/s14-photo-based-analysis.acceptance.test.ts>) | `identifyRockPhotoOnDevice` prefers a configured on-device encoder (bootstrapped from globals) and safely falls back to the byte-based embedder; iOS native module exists with a deterministic placeholder embedding implementation; ORT-backed session + real model still pending |
| `S14-3` | `Done` | [mock-analysis.ts](<../../../lib/mock-analysis.ts>), [s14-photo-based-analysis.acceptance.test.ts](<../../../__tests__/s14-photo-based-analysis.acceptance.test.ts>) | Photo Preview mode falls back safely; Details mode remains default and does not fetch photo bytes |
| `S14-4` | `Partial` | [mock-analysis.ts](<../../../lib/mock-analysis.ts>), [analyzing.tsx](<../../../app/analyzing.tsx>) | Async analysis now emits engine/fallback/duration diagnostics; record final latency/memory once real dev-build inference runs |

Manual QA notes:

- WIP context: `git stash push -m "wip/s14-onnx-native-encoder"`
- Native ONNX seam: app boot attempts to install a native session factory from `NativeModules.RockIdOnnxImageEncoder.runImageEncoder(modelUri, { imageUri })` and then configures the registry via global bootstrap.
- Model URI: default is `bundle://SqueezeNet.onnx` (bundled for on-device smoke testing) but can be overridden by setting `globalThis.__ROCKID_ONNX_MODEL_URI__` before bootstrap.
- Optional native dependency: set `ROCKID_ENABLE_ONNX_RUNTIME=1` and run `pod install` to include the `onnxruntime-objc` pod for iOS builds.
- ORT execution: when `onnxruntime-objc` is present and the model exists in the app bundle, the native module runs ORT inference with image preprocessing (224x224 RGB float tensor) and returns the first output tensor (or `image_embedding` when present).
- Metro LAN deep link example: `com.anonymous.rock-id://expo-development-client/?url=http%3A%2F%2F192.168.100.36%3A8083`
- Device discovery can show “No development servers found” on some networks; manual URL/deeplink works reliably.
- Current identification behavior is mode-driven:
  - Details mode is the default and remains observation-driven.
  - Photo (Preview) mode explicitly exercises the photo-byte embedding path.
  - On-device encoder seam normalizes native vectors and fails safely when native inference is unavailable.
  - Low-confidence photo output preserves the analyzer contract: `topMatch` equals `matches[0]`.
  - `analysis_completed` includes diagnostics: `engine`, `fallback`, and `durationMs`.

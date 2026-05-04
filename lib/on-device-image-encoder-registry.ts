import type { NativeImageEncodeFn, OnDeviceImageEncoder } from './on-device-image-encoder';
import { createOnDeviceImageEncoder } from './on-device-image-encoder';
import type { CreateOnnxSessionFn } from './onnx-image-encoder';
import { createOnnxBackedOnDeviceImageEncoder } from './on-device-image-encoder-adapters';

type OnDeviceImageEncoderConfig =
  | {
      kind: 'native';
      encode: NativeImageEncodeFn;
    }
  | {
      kind: 'onnx';
      modelUri: string;
      createSession: CreateOnnxSessionFn;
    }
  | null;

let config: OnDeviceImageEncoderConfig = null;

/**
 * Configures the app to use a provided native encode function as the on-device image encoder.
 * @param input - Native encoder function that returns an image embedding vector.
 */
export function configureNativeOnDeviceImageEncoder(input: { encode: NativeImageEncodeFn }): void {
  config = { kind: 'native', encode: input.encode };
}

/**
 * Configures the app to use an ONNX-backed encoder as the on-device image encoder.
 * @param input - ONNX model URI and session factory for creating a runnable session.
 */
export function configureOnnxOnDeviceImageEncoder(input: { modelUri: string; createSession: CreateOnnxSessionFn }): void {
  config = { kind: 'onnx', modelUri: input.modelUri, createSession: input.createSession };
}

/**
 * Returns the currently configured on-device image encoder, if any.
 * @returns Encoder implementation, or null if nothing is configured for this build/runtime.
 */
export function getConfiguredOnDeviceImageEncoder(): OnDeviceImageEncoder | null {
  if (!config) return null;

  if (config.kind === 'native') {
    return createOnDeviceImageEncoder({ encode: config.encode });
  }

  return createOnnxBackedOnDeviceImageEncoder({
    modelUri: config.modelUri,
    createSession: config.createSession,
  });
}

/**
 * Resets encoder configuration (tests only).
 */
export function __resetOnDeviceImageEncoderConfigForTesting(): void {
  config = null;
}


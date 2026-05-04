import type { CreateOnnxSessionFn } from './onnx-image-encoder';
import { configureOnnxOnDeviceImageEncoder } from './on-device-image-encoder-registry';

declare global {
  var __ROCKID_ONNX_MODEL_URI__: string | undefined;
  var __ROCKID_CREATE_ONNX_SESSION__: CreateOnnxSessionFn | undefined;
}

/**
 * Bootstraps an ONNX-backed on-device image encoder from global hooks.
 * @returns True when an encoder is configured, otherwise false.
 */
export function bootstrapOnDeviceImageEncoderFromGlobals(): boolean {
  const modelUri = globalThis.__ROCKID_ONNX_MODEL_URI__;
  const createSession = globalThis.__ROCKID_CREATE_ONNX_SESSION__;
  if (!modelUri || !createSession) return false;

  configureOnnxOnDeviceImageEncoder({ modelUri, createSession });
  return true;
}

import type { OnDeviceImageEncoder } from './on-device-image-encoder';
import { OnDeviceImageEncoderUnavailableError } from './on-device-image-encoder';
import type { CreateOnnxSessionFn } from './onnx-image-encoder';
import { createOnnxImageEncoder, OnnxImageEncoderUnavailableError } from './onnx-image-encoder';

/**
 * Creates an OnDeviceImageEncoder implementation backed by an ONNX-like session factory.
 * @param input - Model URI and session factory (e.g., backed by a native ONNX runtime).
 * @returns On-device encoder that exposes encodePhotoUri(photoUri).
 */
export function createOnnxBackedOnDeviceImageEncoder(input: {
  modelUri: string;
  createSession: CreateOnnxSessionFn;
}): OnDeviceImageEncoder {
  const onnxEncoder = createOnnxImageEncoder(input);

  return {
    async encodePhotoUri(photoUri) {
      try {
        return await onnxEncoder.encodePhotoUri(photoUri);
      } catch (error) {
        if (error instanceof OnnxImageEncoderUnavailableError) {
          throw new OnDeviceImageEncoderUnavailableError();
        }
        throw error;
      }
    },
  };
}


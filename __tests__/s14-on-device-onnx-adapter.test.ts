import { describe, expect, it, vi } from 'vitest';

import { createOnnxBackedOnDeviceImageEncoder } from '@/lib/on-device-image-encoder-adapters';
import { OnDeviceImageEncoderUnavailableError } from '@/lib/on-device-image-encoder';

describe('S14 ONNX-backed on-device encoder adapter', () => {
  it('encodes via an ONNX-like session and returns a normalized embedding', async () => {
    const run = vi.fn(async () => ({
      image_embedding: {
        data: Float32Array.from([3, 4]),
      },
    }));
    const createSession = vi.fn(async () => ({ run }));

    const encoder = createOnnxBackedOnDeviceImageEncoder({
      modelUri: 'bundle://models/mobileclip-s0-image.onnx',
      createSession,
    });

    const vector = await encoder.encodePhotoUri('file:///field/granite.jpg');

    expect(createSession).toHaveBeenCalledWith('bundle://models/mobileclip-s0-image.onnx');
    expect(run).toHaveBeenCalledWith({ imageUri: 'file:///field/granite.jpg' });
    expect(vector).toEqual([0.6, 0.8]);
  });

  it('maps ONNX availability failures to the generic on-device encoder error', async () => {
    const encoder = createOnnxBackedOnDeviceImageEncoder({
      modelUri: 'bundle://models/missing.onnx',
      createSession: async () => {
        throw new Error('native module missing');
      },
    });

    await expect(encoder.encodePhotoUri('file:///field/granite.jpg')).rejects.toBeInstanceOf(
      OnDeviceImageEncoderUnavailableError
    );
  });
});


import { describe, expect, it, vi } from 'vitest';

import {
  createOnnxImageEncoder,
  OnnxImageEncoderUnavailableError,
} from '@/lib/onnx-image-encoder';

describe('S14 ONNX image encoder adapter', () => {
  it('runs an ONNX-like session and normalizes the output embedding', async () => {
    const run = vi.fn(async () => ({
      image_embedding: {
        data: Float32Array.from([3, 4]),
      },
    }));
    const createSession = vi.fn(async () => ({ run }));

    const encoder = createOnnxImageEncoder({
      modelUri: 'bundle://models/mobileclip-s0-image.onnx',
      createSession,
    });

    const vector = await encoder.encodePhotoUri('file:///field/basalt.jpg');

    expect(createSession).toHaveBeenCalledWith('bundle://models/mobileclip-s0-image.onnx');
    expect(run).toHaveBeenCalledWith({
      imageUri: 'file:///field/basalt.jpg',
    });
    expect(vector).toEqual([0.6, 0.8]);
  });

  it('wraps model load failures in a safe unavailable error', async () => {
    const encoder = createOnnxImageEncoder({
      modelUri: 'bundle://models/missing.onnx',
      createSession: async () => {
        throw new Error('native module missing');
      },
    });

    await expect(encoder.encodePhotoUri('file:///field/basalt.jpg')).rejects.toBeInstanceOf(
      OnnxImageEncoderUnavailableError
    );
  });
});

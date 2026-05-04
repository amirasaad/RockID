import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  __resetOnDeviceImageEncoderConfigForTesting,
  getConfiguredOnDeviceImageEncoder,
} from '@/lib/on-device-image-encoder-registry';
import { bootstrapOnDeviceImageEncoderFromGlobals } from '@/lib/on-device-image-encoder-bootstrap';

describe('S14 on-device image encoder bootstrap', () => {
  afterEach(() => {
    __resetOnDeviceImageEncoderConfigForTesting();
    delete (globalThis as Record<string, unknown>).__ROCKID_ONNX_MODEL_URI__;
    delete (globalThis as Record<string, unknown>).__ROCKID_CREATE_ONNX_SESSION__;
    vi.restoreAllMocks();
  });

  it('returns false when globals are missing', () => {
    expect(bootstrapOnDeviceImageEncoderFromGlobals()).toBe(false);
    expect(getConfiguredOnDeviceImageEncoder()).toBe(null);
  });

  it('configures an ONNX-backed encoder when globals are present', async () => {
    (globalThis as Record<string, unknown>).__ROCKID_ONNX_MODEL_URI__ = 'bundle://models/mobileclip-s0-image.onnx';
    (globalThis as Record<string, unknown>).__ROCKID_CREATE_ONNX_SESSION__ = async () => ({
      run: vi.fn(async () => ({
        image_embedding: { data: Float32Array.from([3, 4]) },
      })),
    });

    expect(bootstrapOnDeviceImageEncoderFromGlobals()).toBe(true);
    const encoder = getConfiguredOnDeviceImageEncoder();
    expect(encoder).not.toBe(null);
    await expect(encoder!.encodePhotoUri('file:///field/granite.jpg')).resolves.toEqual([0.6, 0.8]);
  });
});


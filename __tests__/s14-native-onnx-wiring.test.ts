import { afterEach, describe, expect, it, vi } from 'vitest';

const NativeModules: Record<string, unknown> = {};

vi.mock('react-native', () => ({
  NativeModules,
}));

describe('S14 native ONNX wiring shim', () => {
  afterEach(() => {
    delete (globalThis as Record<string, unknown>).__ROCKID_ONNX_MODEL_URI__;
    delete (globalThis as Record<string, unknown>).__ROCKID_CREATE_ONNX_SESSION__;
    for (const key of Object.keys(NativeModules)) {
      delete NativeModules[key];
    }
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it('installs global session hooks when the native module is available', async () => {
    const runImageEncoder = vi.fn(async () => ({
      image_embedding: { data: Float32Array.from([3, 4]) },
    }));

    NativeModules.RockIdOnnxImageEncoder = { runImageEncoder };

    const { tryInstallNativeOnnxSessionFactory } = await import('@/lib/onnx-native-wiring');

    const installed = await tryInstallNativeOnnxSessionFactory({
      defaultModelUri: 'bundle://models/mobileclip-s0-image.onnx',
    });

    expect(installed).toBe(true);
    expect((globalThis as Record<string, unknown>).__ROCKID_ONNX_MODEL_URI__).toBe(
      'bundle://models/mobileclip-s0-image.onnx'
    );
    expect(typeof (globalThis as Record<string, unknown>).__ROCKID_CREATE_ONNX_SESSION__).toBe('function');

    const createSession = (globalThis as Record<string, unknown>).__ROCKID_CREATE_ONNX_SESSION__ as (
      modelUri: string
    ) => Promise<{ run: (feeds: { imageUri: string }) => Promise<unknown> }>;
    const session = await createSession('bundle://models/mobileclip-s0-image.onnx');
    const output = await session.run({ imageUri: 'file:///field/granite.jpg' });

    expect(runImageEncoder).toHaveBeenCalledWith('bundle://models/mobileclip-s0-image.onnx', {
      imageUri: 'file:///field/granite.jpg',
    });
    expect(output).toEqual({ image_embedding: { data: Float32Array.from([3, 4]) } });
  });

  it('returns false when the native module is not present', async () => {
    const { tryInstallNativeOnnxSessionFactory } = await import('@/lib/onnx-native-wiring');

    await expect(
      tryInstallNativeOnnxSessionFactory({
        defaultModelUri: 'bundle://models/mobileclip-s0-image.onnx',
      })
    ).resolves.toBe(false);
  });
});

import type { CreateOnnxSessionFn, OnnxSessionRunOutput } from '@/lib/onnx-image-encoder';
import { NativeModules } from 'react-native';

type RockIdOnnxNativeModule = {
  runImageEncoder: (modelUri: string, input: { imageUri: string }) => Promise<OnnxSessionRunOutput>;
};

export async function tryInstallNativeOnnxSessionFactory(input?: { defaultModelUri?: string }): Promise<boolean> {
  const globalHooks = globalThis as unknown as {
    __ROCKID_ONNX_MODEL_URI__?: string;
    __ROCKID_CREATE_ONNX_SESSION__?: CreateOnnxSessionFn;
  };

  if (typeof globalHooks.__ROCKID_CREATE_ONNX_SESSION__ === 'function') return false;

  const nativeModule = (NativeModules as Record<string, unknown>)['RockIdOnnxImageEncoder'] as
    | RockIdOnnxNativeModule
    | undefined;

  if (!nativeModule || typeof nativeModule.runImageEncoder !== 'function') return false;

  if (!globalHooks.__ROCKID_ONNX_MODEL_URI__ && input?.defaultModelUri) {
    globalHooks.__ROCKID_ONNX_MODEL_URI__ = input.defaultModelUri;
  }

  globalHooks.__ROCKID_CREATE_ONNX_SESSION__ = (async (modelUri: string) => {
    return {
      run: async (feeds: { imageUri: string }) => {
        return nativeModule.runImageEncoder(modelUri, feeds);
      },
    };
  }) satisfies CreateOnnxSessionFn;

  return true;
}


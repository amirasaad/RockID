import { normalizeVector, type Vector } from './clip-knn';

export type OnnxSessionRunOutput = {
  image_embedding?: {
    data?: Float32Array | number[];
  };
};

export type CreateOnnxSessionFn = (modelUri: string) => Promise<{ run: (feeds: { imageUri: string }) => Promise<OnnxSessionRunOutput> }>;

export type OnnxImageEncoder = {
  encodePhotoUri: (photoUri: string) => Promise<Vector>;
};

export class OnnxImageEncoderUnavailableError extends Error {
  constructor() {
    super('ONNX image encoder is not available in this build.');
    this.name = 'OnnxImageEncoderUnavailableError';
  }
}

/**
 * Creates an ONNX-like image encoder adapter that normalizes the produced embedding.
 * @param input - Model URI and a session factory (e.g., backed by onnxruntime-react-native).
 * @returns Encoder with an encodePhotoUri(photoUri) function.
 */
export function createOnnxImageEncoder(input: { modelUri: string; createSession: CreateOnnxSessionFn }): OnnxImageEncoder {
  let sessionPromise:
    | Promise<{ run: (feeds: { imageUri: string }) => Promise<OnnxSessionRunOutput> }>
    | null = null;

  async function getSession() {
    if (!sessionPromise) {
      sessionPromise = input.createSession(input.modelUri);
    }

    try {
      return await sessionPromise;
    } catch (error) {
      sessionPromise = null;
      throw new OnnxImageEncoderUnavailableError();
    }
  }

  return {
    async encodePhotoUri(photoUri) {
      const session = await getSession();
      let output: OnnxSessionRunOutput;
      try {
        output = await session.run({ imageUri: photoUri });
      } catch (error) {
        throw new OnnxImageEncoderUnavailableError();
      }
      const raw = output?.image_embedding?.data;
      if (!raw) {
        throw new Error('ONNX image encoder did not return an image_embedding.');
      }

      return normalizeVector(Array.from(raw));
    },
  };
}

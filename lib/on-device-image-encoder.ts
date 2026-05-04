import { normalizeVector, type Vector } from './clip-knn';

export type NativeImageEncodeFn = (photoUri: string) => Promise<Vector>;

export type OnDeviceImageEncoder = {
  encodePhotoUri: (photoUri: string) => Promise<Vector>;
};

export class OnDeviceImageEncoderUnavailableError extends Error {
  constructor() {
    super('On-device image encoder is not available in this build.');
    this.name = 'OnDeviceImageEncoderUnavailableError';
  }
}

export function createOnDeviceImageEncoder(input?: { encode: NativeImageEncodeFn }): OnDeviceImageEncoder {
  return {
    async encodePhotoUri(photoUri) {
      if (!input?.encode) {
        throw new OnDeviceImageEncoderUnavailableError();
      }

      return normalizeVector(await input.encode(photoUri));
    },
  };
}

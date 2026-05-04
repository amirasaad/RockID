import { afterEach, describe, expect, it, vi } from 'vitest';

import { embedPhotoUriToVector, embedPhotoUriToVectorConvenient, identifyRockPhotoOnDevice } from '@/lib/clip-bytes-embedder';
import {
  __resetOnDeviceImageEncoderConfigForTesting,
  configureNativeOnDeviceImageEncoder,
} from '@/lib/on-device-image-encoder-registry';

describe('S14 photo URI embedder', () => {
  afterEach(() => {
    __resetOnDeviceImageEncoderConfigForTesting();
    vi.restoreAllMocks();
  });

  it('embeds a photo URI by reading bytes via an injected dependency', async () => {
    const readBytes = vi.fn(async () => Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8]));

    const vector = await embedPhotoUriToVector({
      photoUri: 'file:///field/example.jpg',
      dimension: 4,
      readBytes,
    });

    expect(readBytes).toHaveBeenCalledWith('file:///field/example.jpg');
    expect(vector).toHaveLength(4);
    const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
    expect(norm).toBeCloseTo(1, 8);
  });

  it('embeds a photo URI with the default byte reader', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      status: 200,
      arrayBuffer: async () => Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8]).buffer,
    }));

    vi.stubGlobal('fetch', fetchMock);

    const vector = await embedPhotoUriToVectorConvenient({
      photoUri: 'https://example.com/sample.jpg',
      dimension: 4,
    });

    expect(fetchMock).toHaveBeenCalledWith('https://example.com/sample.jpg');
    expect(vector).toHaveLength(4);
    const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
    expect(norm).toBeCloseTo(1, 8);
  });

  it('prefers a configured on-device encoder over the byte-based embedder', async () => {
    const encode = vi.fn(async () => [3, 4]);
    configureNativeOnDeviceImageEncoder({ encode });

    const fetchMock = vi.fn(async () => {
      throw new Error('fetch() should not be used when an on-device encoder is available.');
    });
    vi.stubGlobal('fetch', fetchMock);

    const vector = await identifyRockPhotoOnDevice({
      photoUri: 'https://example.com/sample.jpg',
      embeddingDimension: 2,
    });

    expect(encode).toHaveBeenCalledWith('https://example.com/sample.jpg');
    expect(fetchMock).not.toHaveBeenCalled();
    expect(vector).toEqual([0.6, 0.8]);
  });

  it('exposes an identifyRockPhotoOnDevice helper that returns an embedding', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      status: 200,
      arrayBuffer: async () => Uint8Array.from([9, 8, 7, 6, 5, 4, 3, 2]).buffer,
    }));

    vi.stubGlobal('fetch', fetchMock);

    const vector = await identifyRockPhotoOnDevice({
      photoUri: 'https://example.com/sample.jpg',
      embeddingDimension: 8,
    });

    expect(vector).toHaveLength(8);
    const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
    expect(norm).toBeCloseTo(1, 8);
  });
});

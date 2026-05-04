import { describe, expect, it, vi } from 'vitest';

import { createOnDeviceImageEncoder, OnDeviceImageEncoderUnavailableError } from '@/lib/on-device-image-encoder';

describe('S14 on-device image encoder contract', () => {
  it('normalizes vectors returned by an available native encoder', async () => {
    const encode = vi.fn(async () => [3, 4]);
    const encoder = createOnDeviceImageEncoder({ encode });

    const vector = await encoder.encodePhotoUri('file:///field/granite.jpg');

    expect(encode).toHaveBeenCalledWith('file:///field/granite.jpg');
    expect(vector).toEqual([0.6, 0.8]);
  });

  it('fails safely when no native encoder is available yet', async () => {
    const encoder = createOnDeviceImageEncoder();

    await expect(encoder.encodePhotoUri('file:///field/granite.jpg')).rejects.toBeInstanceOf(
      OnDeviceImageEncoderUnavailableError
    );
  });
});

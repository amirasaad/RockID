import { describe, expect, it, vi } from 'vitest';

import { base64ToBytes, readPhotoBytes } from '@/lib/clip-bytes-embedder';

describe('S14 photo bytes reader', () => {
  it('decodes base64 into bytes', () => {
    expect(Array.from(base64ToBytes('AQID'))).toEqual([1, 2, 3]);
    expect(Array.from(base64ToBytes(''))).toEqual([]);
  });

  it('reads http(s) photo bytes via fetch', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      status: 200,
      arrayBuffer: async () => Uint8Array.from([9, 8, 7]).buffer,
    }));

    vi.stubGlobal('fetch', fetchMock);

    const bytes = await readPhotoBytes({ photoUri: 'https://example.com/sample.jpg' });

    expect(fetchMock).toHaveBeenCalledWith('https://example.com/sample.jpg');
    expect(Array.from(bytes)).toEqual([9, 8, 7]);
  });
});


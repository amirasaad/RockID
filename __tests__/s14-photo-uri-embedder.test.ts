import { describe, expect, it, vi } from 'vitest';

import { embedPhotoUriToVector } from '@/lib/clip-bytes-embedder';

describe('S14 photo URI embedder', () => {
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
});


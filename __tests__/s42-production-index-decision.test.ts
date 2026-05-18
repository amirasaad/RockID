import { describe, expect, it } from 'vitest';

import { retrieveByCosine } from '@/lib/clip-knn';
import { photoIndex } from '@/lib/on-device-clip-knn-analysis';

describe('S42 production index decision', () => {
  it('keeps the promoted Basalt support candidate safe under same-label-aware confidence', () => {
    expect(photoIndex.map((item) => item.id)).toContain('photo-basalt-vesicular-shade-support-1');

    const clearBasalt = retrieveByCosine({
      queryEmbedding: photoIndex.find((item) => item.id === 'photo-basalt-1')!.embedding,
      items: photoIndex,
      topK: 3,
    });

    expect(clearBasalt.matches[0].item.id).toBe('photo-basalt-1');
    expect(clearBasalt.matches[1].item.id).toBe('photo-basalt-vesicular-shade-support-1');
    expect(clearBasalt.confidence).toBe('High');
  });
});

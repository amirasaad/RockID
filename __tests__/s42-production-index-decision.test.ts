import { describe, expect, it } from 'vitest';

import { photoIndex } from '@/lib/on-device-clip-knn-analysis';

describe('S42 production index decision', () => {
  it('keeps the Basalt support candidate out of production after expanded-eval rollback signal', () => {
    expect(photoIndex.map((item) => item.id)).not.toContain('photo-basalt-vesicular-shade-support-1');
  });
});

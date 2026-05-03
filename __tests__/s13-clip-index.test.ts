import { describe, expect, it } from 'vitest';

import { loadClipIndexFromFile } from '@/lib/clip-index';

describe('S13 clip index', () => {
  it('loads the demo CLIP index artifact and validates dimensions', async () => {
    const index = await loadClipIndexFromFile('data/clip/demo-index.json');

    expect(index.version).toBe(1);
    expect(index.embeddingDimension).toBeGreaterThan(1);
    expect(index.items.length).toBeGreaterThan(0);
    expect(index.items[0]?.embedding.length).toBe(index.embeddingDimension);
  });

  it('rejects indexes with inconsistent embedding dimensions', () => {
    expect(loadClipIndexFromFile('__tests__/__fixtures__/invalid-index-dimensions.json')).rejects.toThrow(/dimension/i);
  });
});

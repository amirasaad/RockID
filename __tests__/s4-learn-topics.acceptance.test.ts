import { describe, expect, it } from 'vitest';

import { createLearnTopicsViewModel } from '@/lib/learn-view-model';

describe('S4 learn topic details acceptance', () => {
  it('creates a stable slug and href for each learn topic', () => {
    const viewModel = createLearnTopicsViewModel(['Igneous Rocks', 'Grain Size Guide']);

    expect(viewModel.items).toEqual([
      { title: 'Igneous Rocks', slug: 'igneous-rocks', href: '/learn/igneous-rocks' },
      { title: 'Grain Size Guide', slug: 'grain-size-guide', href: '/learn/grain-size-guide' },
    ]);
  });
});

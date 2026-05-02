import { describe, expect, it } from 'vitest';

import type { SavedFind } from '@/lib/saved-finds';
import { createIdentifyRecentFindsViewModel } from '@/lib/identify-view-model';

describe('S6 identify recent finds acceptance', () => {
  it('returns an empty state when no saved finds exist', () => {
    const viewModel = createIdentifyRecentFindsViewModel([]);

    expect(viewModel).toEqual({
      kind: 'empty',
      title: 'No recent finds yet',
      message: 'Save an identification result to see it here.',
      items: [],
    });
  });

  it('returns up to 3 most recent saved finds (newest-first)', () => {
    const older = savedFind({ id: 'find-older', title: 'Granite', savedAt: 100 });
    const newer = savedFind({ id: 'find-newer', title: 'Basalt', savedAt: 200 });
    const newest = savedFind({ id: 'find-newest', title: 'Quartzite', savedAt: 300 });
    const extra = savedFind({ id: 'find-extra', title: 'Slate', savedAt: 400 });

    const viewModel = createIdentifyRecentFindsViewModel([older, newest, newer, extra]);

    expect(viewModel.kind).toBe('populated');
    if (viewModel.kind !== 'populated') return;

    expect(viewModel.items.map((item) => item.id)).toEqual(['find-extra', 'find-newest', 'find-newer']);
    expect(viewModel.items[0]).toEqual({
      id: 'find-extra',
      title: 'Slate',
      confidenceLabel: 'Medium confidence',
      savedAtLabel: 'Saved Jan 1, 1970',
      href: { pathname: '/saved/[id]', params: { id: 'find-extra' } },
    });
  });

  it('breaks savedAt ties consistently using title order', () => {
    const zeta = savedFind({ id: 'find-zeta', title: 'Zeta', savedAt: 500 });
    const alpha = savedFind({ id: 'find-alpha', title: 'Alpha', savedAt: 500 });

    const viewModel = createIdentifyRecentFindsViewModel([zeta, alpha]);

    expect(viewModel.kind).toBe('populated');
    if (viewModel.kind !== 'populated') return;

    expect(viewModel.items.map((item) => item.id)).toEqual(['find-alpha', 'find-zeta']);
  });
});

function savedFind(overrides: Pick<SavedFind, 'id' | 'title' | 'savedAt'>): SavedFind {
  return {
    id: overrides.id,
    sessionId: `session-${overrides.id}`,
    imageUri: `file:///field/${overrides.id}.jpg`,
    title: overrides.title,
    confidence: 'Medium',
    notes: '',
    savedAt: overrides.savedAt,
    topMatch: {
      name: overrides.title,
      category: 'Igneous intrusive',
      confidence: 'Medium',
      score: 72,
    },
    matches: [],
  };
}

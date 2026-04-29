import { describe, expect, it, vi } from 'vitest';

import { selectRockPhotoFromLibrary } from '@/lib/photo-input';

describe('S1-1 gallery upload acceptance', () => {
  it('returns a review-ready upload photo when the user chooses a rock image from the library', async () => {
    const requestMediaLibraryPermission = vi.fn().mockResolvedValue({ granted: true });
    const launchImageLibrary = vi.fn().mockResolvedValue({
      canceled: false,
      assets: [
        {
          uri: 'file:///field/granite-sample.jpg',
          width: 1600,
          height: 1200,
        },
      ],
    });

    const result = await selectRockPhotoFromLibrary({
      requestMediaLibraryPermission,
      launchImageLibrary,
    });

    expect(requestMediaLibraryPermission).toHaveBeenCalledOnce();
    expect(launchImageLibrary).toHaveBeenCalledWith({
      allowsEditing: false,
      quality: 1,
    });
    expect(result).toEqual({
      kind: 'selected',
      source: 'upload',
      uri: 'file:///field/granite-sample.jpg',
      width: 1600,
      height: 1200,
    });
  });
});

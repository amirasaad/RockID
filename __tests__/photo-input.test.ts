import { describe, expect, it, vi } from 'vitest';

import { selectRockPhotoFromLibrary } from '@/lib/photo-input';

describe('selectRockPhotoFromLibrary', () => {
  it('returns permission-denied and does not open the picker when library permission is denied', async () => {
    const requestMediaLibraryPermission = vi.fn().mockResolvedValue({ granted: false });
    const launchImageLibrary = vi.fn();

    const result = await selectRockPhotoFromLibrary({
      requestMediaLibraryPermission,
      launchImageLibrary,
    });

    expect(launchImageLibrary).not.toHaveBeenCalled();
    expect(result).toEqual({
      kind: 'permission-denied',
      source: 'upload',
    });
  });

  it('returns cancelled when the user closes the image picker without choosing a photo', async () => {
    const requestMediaLibraryPermission = vi.fn().mockResolvedValue({ granted: true });
    const launchImageLibrary = vi.fn().mockResolvedValue({ canceled: true });

    const result = await selectRockPhotoFromLibrary({
      requestMediaLibraryPermission,
      launchImageLibrary,
    });

    expect(launchImageLibrary).toHaveBeenCalledWith({
      allowsEditing: false,
      quality: 1,
    });
    expect(result).toEqual({
      kind: 'cancelled',
      source: 'upload',
    });
  });
});

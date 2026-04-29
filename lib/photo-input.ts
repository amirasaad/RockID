type PermissionResult = {
  granted: boolean;
};

type SelectRockPhotoFromLibraryDependencies = {
  requestMediaLibraryPermission: () => Promise<PermissionResult>;
  launchImageLibrary: (options: {
    allowsEditing: false;
    quality: 1;
  }) => Promise<{
    canceled: boolean;
  }>;
};

export type PhotoInputResult =
  | {
      kind: 'permission-denied';
      source: 'upload';
    }
  | {
      kind: 'cancelled';
      source: 'upload';
    };

export async function selectRockPhotoFromLibrary({
  requestMediaLibraryPermission,
  launchImageLibrary,
}: SelectRockPhotoFromLibraryDependencies): Promise<PhotoInputResult> {
  const permission = await requestMediaLibraryPermission();

  if (!permission.granted) {
    return {
      kind: 'permission-denied',
      source: 'upload',
    };
  }

  const selection = await launchImageLibrary({
    allowsEditing: false,
    quality: 1,
  });

  if (selection.canceled) {
    return {
      kind: 'cancelled',
      source: 'upload',
    };
  }

  throw new Error('Gallery selection is not implemented yet.');
}

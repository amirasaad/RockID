type PermissionResult = {
  granted: boolean;
};

type SelectRockPhotoFromLibraryDependencies = {
  requestMediaLibraryPermission: () => Promise<PermissionResult>;
  launchImageLibrary: (options: {
    allowsEditing: false;
    quality: 1;
  }) => Promise<unknown>;
};

export type PhotoInputResult =
  | {
      kind: 'permission-denied';
      source: 'upload';
    };

export async function selectRockPhotoFromLibrary({
  requestMediaLibraryPermission,
}: SelectRockPhotoFromLibraryDependencies): Promise<PhotoInputResult> {
  const permission = await requestMediaLibraryPermission();

  if (!permission.granted) {
    return {
      kind: 'permission-denied',
      source: 'upload',
    };
  }

  throw new Error('Gallery selection is not implemented yet.');
}

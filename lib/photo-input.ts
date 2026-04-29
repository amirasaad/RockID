type PermissionResult = {
  granted: boolean;
};

type ImagePickerAsset = {
  uri: string;
  width?: number;
  height?: number;
};

type SelectRockPhotoFromLibraryDependencies = {
  requestMediaLibraryPermission: () => Promise<PermissionResult>;
  launchImageLibrary: (options: {
    allowsEditing: false;
    quality: 1;
  }) => Promise<{
    canceled: boolean;
    assets?: ImagePickerAsset[];
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
    }
  | {
      kind: 'selected';
      source: 'upload';
      uri: string;
      width?: number;
      height?: number;
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

  const [asset] = selection.assets ?? [];

  if (!asset) {
    return {
      kind: 'cancelled',
      source: 'upload',
    };
  }

  return {
    kind: 'selected',
    source: 'upload',
    uri: asset.uri,
    width: asset.width,
    height: asset.height,
  };
}

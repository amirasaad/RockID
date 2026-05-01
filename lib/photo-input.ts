type PermissionResult = {
  granted: boolean;
};

type ImagePickerAsset = {
  uri: string;
  width?: number;
  height?: number;
};

type LibraryPickerOptions = {
  allowsEditing: false;
  quality: 1;
};

type LibrarySelection = {
  canceled: boolean;
  assets?: ImagePickerAsset[];
};

type LibraryPhotoInputDependencies = {
  requestMediaLibraryPermission: () => Promise<PermissionResult>;
  launchImageLibrary: (options: LibraryPickerOptions) => Promise<LibrarySelection>;
};

type PermissionDeniedResult = {
  kind: 'permission-denied';
  source: 'upload';
};

type CancelledResult = {
  kind: 'cancelled';
  source: 'upload';
};

type SelectedResult = {
  kind: 'selected';
  source: 'upload';
  uri: string;
  width?: number;
  height?: number;
};

const libraryPickerOptions: LibraryPickerOptions = {
  allowsEditing: false,
  quality: 1,
};

export type PhotoInputResult = PermissionDeniedResult | CancelledResult | SelectedResult;

export async function selectRockPhotoFromLibrary({
  requestMediaLibraryPermission,
  launchImageLibrary,
}: LibraryPhotoInputDependencies): Promise<PhotoInputResult> {
  const permission = await requestMediaLibraryPermission();
  return permission.granted ? selectPermittedLibraryPhoto(launchImageLibrary) : permissionDenied();
}

async function selectPermittedLibraryPhoto(
  launchImageLibrary: LibraryPhotoInputDependencies['launchImageLibrary']
): Promise<PhotoInputResult> {
  const selection = await launchImageLibrary(libraryPickerOptions);
  return selection.canceled ? cancelled() : selectedOrCancelled(selection.assets);
}

function selectedOrCancelled(assets: ImagePickerAsset[] = []): SelectedResult | CancelledResult {
  const [asset] = assets;
  return asset ? selected(asset) : cancelled();
}

function permissionDenied(): PermissionDeniedResult {
  return {
    kind: 'permission-denied',
    source: 'upload',
  };
}

function cancelled(): CancelledResult {
  return {
    kind: 'cancelled',
    source: 'upload',
  };
}

function selected(asset: ImagePickerAsset): SelectedResult {
  return {
    kind: 'selected',
    source: 'upload',
    uri: asset.uri,
    width: asset.width,
    height: asset.height,
  };
}

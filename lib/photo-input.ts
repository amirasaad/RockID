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

type CameraPhotoInputDependencies = {
  requestCameraPermission: () => Promise<PermissionResult>;
  launchCamera: (options: LibraryPickerOptions) => Promise<LibrarySelection>;
};

type PhotoSource = 'upload' | 'camera';

type PermissionDeniedResult = {
  kind: 'permission-denied';
  source: PhotoSource;
};

type CancelledResult = {
  kind: 'cancelled';
  source: PhotoSource;
};

type SelectedResult = {
  kind: 'selected';
  source: PhotoSource;
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
  return permission.granted
    ? selectPermittedPhoto(launchImageLibrary, 'upload')
    : permissionDenied('upload');
}

export async function selectRockPhotoFromCamera({
  requestCameraPermission,
  launchCamera,
}: CameraPhotoInputDependencies): Promise<PhotoInputResult> {
  const permission = await requestCameraPermission();
  return permission.granted ? selectPermittedPhoto(launchCamera, 'camera') : permissionDenied('camera');
}

async function selectPermittedPhoto(
  launchPicker: (options: LibraryPickerOptions) => Promise<LibrarySelection>,
  source: PhotoSource
): Promise<PhotoInputResult> {
  const selection = await launchPicker(libraryPickerOptions);
  return selection.canceled ? cancelled(source) : selectedOrCancelled(selection.assets, source);
}

function selectedOrCancelled(
  assets: ImagePickerAsset[] = [],
  source: PhotoSource
): SelectedResult | CancelledResult {
  const [asset] = assets;
  return asset ? selected(asset, source) : cancelled(source);
}

function permissionDenied(source: PhotoSource): PermissionDeniedResult {
  return {
    kind: 'permission-denied',
    source,
  };
}

function cancelled(source: PhotoSource): CancelledResult {
  return {
    kind: 'cancelled',
    source,
  };
}

function selected(asset: ImagePickerAsset, source: PhotoSource): SelectedResult {
  return {
    kind: 'selected',
    source,
    uri: asset.uri,
    width: asset.width,
    height: asset.height,
  };
}

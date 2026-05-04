type PersistSavedPhotoInput = {
  photoUri: string;
  savedFindId: string;
};

function isWebRuntime(): boolean {
  return typeof document !== 'undefined';
}

function safeFileBasename(input: string): string {
  return input.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export async function persistSavedPhotoUriAsync(input: PersistSavedPhotoInput): Promise<string> {
  if (isWebRuntime()) return input.photoUri;

  const FileSystem = (await import('expo-file-system')) as typeof import('expo-file-system');
  const ImageManipulator = (await import('expo-image-manipulator')) as typeof import('expo-image-manipulator');

  const docDir = FileSystem.Paths.document.uri;
  const savedDir = `${docDir}rockid/saved/`;
  const safeId = safeFileBasename(input.savedFindId);
  const destUri = `${savedDir}${safeId}.jpg`;

  if (input.photoUri.startsWith(savedDir)) {
    return input.photoUri;
  }

  const savedDirectory = new FileSystem.Directory(savedDir);
  savedDirectory.create({ intermediates: true, idempotent: true });

  let sourceUri = input.photoUri;
  if (input.photoUri.startsWith('http://') || input.photoUri.startsWith('https://')) {
    const cacheDir = FileSystem.Paths.cache.uri;
    const downloadDirectory = new FileSystem.Directory(`${cacheDir}rockid/downloads/`);
    downloadDirectory.create({ intermediates: true, idempotent: true });
    const downloaded = await FileSystem.File.downloadFileAsync(input.photoUri, downloadDirectory, { idempotent: true });
    sourceUri = downloaded.uri;
  }

  const manipulated = await ImageManipulator.manipulateAsync(
    sourceUri,
    [{ resize: { width: 1280 } }],
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
  );

  const manipulatedFile = new FileSystem.File(manipulated.uri);
  manipulatedFile.copy(new FileSystem.File(destUri));
  return destUri;
}

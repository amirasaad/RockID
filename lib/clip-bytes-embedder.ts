import { normalizeVector } from './clip-knn';

/**
 * Creates a deterministic embedding vector from raw bytes.
 * @param input - Byte array (0-255) or Uint8Array.
 * @param dimension - Output embedding dimension.
 * @returns Normalized embedding vector of length `dimension`.
 */
export function embedBytesToVector(input: Uint8Array | number[], dimension: number): number[] {
  if (!Number.isInteger(dimension) || dimension <= 0) {
    throw new Error('Embedding dimension must be a positive integer.');
  }

  const buckets = Array.from({ length: dimension }, () => 0);
  const bytes = input instanceof Uint8Array ? input : Uint8Array.from(input);

  for (let i = 0; i < bytes.length; i += 1) {
    buckets[i % dimension] += bytes[i] ?? 0;
  }

  return normalizeVector(buckets);
}

export type ReadPhotoBytesFn = (photoUri: string) => Promise<Uint8Array>;

export async function readPhotoBytes(input: { photoUri: string }): Promise<Uint8Array> {
  if (input.photoUri.startsWith('http://') || input.photoUri.startsWith('https://')) {
    if (typeof fetch !== 'function') {
      throw new Error('Global fetch() is not available for http(s) photo URIs.');
    }
    const response = await fetch(input.photoUri);
    if (!response.ok) {
      throw new Error(`Failed to fetch photo bytes (status ${response.status}).`);
    }
    const buffer = await response.arrayBuffer();
    return new Uint8Array(buffer);
  }

  const FileSystem = await import('expo-file-system');
  const base64 = await FileSystem.readAsStringAsync(input.photoUri, { encoding: 'base64' });
  return base64ToBytes(base64);
}

export async function embedPhotoUriToVector(input: {
  photoUri: string;
  dimension: number;
  readBytes: ReadPhotoBytesFn;
}): Promise<number[]> {
  const bytes = await input.readBytes(input.photoUri);
  return embedBytesToVector(bytes, input.dimension);
}

export async function embedPhotoUriToVectorConvenient(input: { photoUri: string; dimension: number }): Promise<number[]> {
  return embedPhotoUriToVector({
    photoUri: input.photoUri,
    dimension: input.dimension,
    readBytes: async (photoUri) => readPhotoBytes({ photoUri }),
  });
}

export async function identifyRockPhotoOnDevice(input: { photoUri: string; embeddingDimension: number }): Promise<number[]> {
  return embedPhotoUriToVectorConvenient({ photoUri: input.photoUri, dimension: input.embeddingDimension });
}

export function base64ToBytes(base64: string): Uint8Array {
  const normalized = base64.replace(/[\r\n\s]/g, '');
  if (normalized.length === 0) return new Uint8Array();

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const lookup = new Uint8Array(256);
  lookup.fill(255);
  for (let i = 0; i < alphabet.length; i += 1) {
    lookup[alphabet.charCodeAt(i)] = i;
  }
  lookup['='.charCodeAt(0)] = 0;

  const bytes: number[] = [];
  for (let i = 0; i < normalized.length; i += 4) {
    const c0 = normalized.charCodeAt(i);
    const c1 = normalized.charCodeAt(i + 1);
    const c2 = normalized.charCodeAt(i + 2);
    const c3 = normalized.charCodeAt(i + 3);

    const v0 = lookup[c0] ?? 255;
    const v1 = lookup[c1] ?? 255;
    const v2 = lookup[c2] ?? 255;
    const v3 = lookup[c3] ?? 255;

    if (v0 === 255 || v1 === 255 || v2 === 255 || v3 === 255) {
      throw new Error('Invalid base64 input.');
    }

    const triplet = (v0 << 18) | (v1 << 12) | (v2 << 6) | v3;
    const b0 = (triplet >> 16) & 0xff;
    const b1 = (triplet >> 8) & 0xff;
    const b2 = triplet & 0xff;

    const p2 = normalized[i + 2] === '=';
    const p3 = normalized[i + 3] === '=';

    bytes.push(b0);
    if (!p2) bytes.push(b1);
    if (!p3) bytes.push(b2);
  }

  return Uint8Array.from(bytes);
}

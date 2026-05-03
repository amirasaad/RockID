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

export async function embedPhotoUriToVector(input: {
  photoUri: string;
  dimension: number;
  readBytes: ReadPhotoBytesFn;
}): Promise<number[]> {
  const bytes = await input.readBytes(input.photoUri);
  return embedBytesToVector(bytes, input.dimension);
}

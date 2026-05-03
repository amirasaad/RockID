import { normalizeVector } from './clip-knn';
import type { ClipIndex, ClipIndexItem } from './clip-index';

export type ClipIndexManifest = {
  version: 1;
  embeddingDimension: number;
  items: Array<Omit<ClipIndexItem, 'embedding'>>;
};

/**
 * Generates a CLIP index from a manifest, using a deterministic placeholder embedder.
 * @param manifest - Manifest describing items to include in the index.
 * @returns Generated CLIP index.
 */
export function generateClipIndexFromManifest(manifest: ClipIndexManifest): ClipIndex {
  return {
    version: 1,
    embeddingDimension: manifest.embeddingDimension,
    items: manifest.items.map((item) => ({
      ...item,
      embedding: generateDemoEmbedding(item.label, manifest.embeddingDimension),
    })),
  };
}

/**
 * Produces a deterministic, normalized embedding for demo/testing.
 * @param label - Item label (used to pick a stable direction).
 * @param dimension - Embedding dimension.
 * @returns Normalized embedding vector.
 */
function generateDemoEmbedding(label: string, dimension: number): number[] {
  const position = positionForLabel(label, dimension);
  const raw = Array.from({ length: dimension }, (_, index) => (index === position ? 1 : 0));
  return normalizeVector(raw);
}

/**
 * Maps a known label to a stable one-hot position, with a fallback hash for unknown labels.
 * @param label - Label to map.
 * @param dimension - Embedding dimension.
 * @returns Position in [0, dimension-1].
 */
function positionForLabel(label: string, dimension: number): number {
  const known = {
    Granite: 0,
    Basalt: 1,
    Slag: 2,
    Obsidian: 3,
  } as const;

  const direct = known[label as keyof typeof known];
  if (typeof direct === 'number') {
    return direct % dimension;
  }

  return hashString(label) % dimension;
}

/**
 * Hashes a string into a stable non-negative integer.
 * @param value - Input string.
 * @returns Hash value.
 */
function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}


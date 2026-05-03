import { readFile, writeFile } from 'node:fs/promises';

/**
 * Parses argv flags into a simple key/value map.
 * @param {string[]} argv - Raw argv list (excluding node and script path).
 * @returns {{ manifest: string; out: string }} Parsed args.
 */
function parseArgs(argv) {
  /** @type {Record<string, string>} */
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token?.startsWith('--')) continue;
    const key = token.slice(2);
    const value = argv[i + 1];
    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for --${key}`);
    }
    args[key] = value;
    i += 1;
  }

  if (!args.manifest || !args.out) {
    throw new Error('Usage: node scripts/generate-clip-index.mjs --manifest <path> --out <path>');
  }

  return /** @type {{ manifest: string; out: string }} */ ({ manifest: args.manifest, out: args.out });
}

/**
 * Generates a CLIP index payload from a manifest payload, using deterministic demo embeddings.
 * @param {{ version: 1; embeddingDimension: number; items: Array<{ id: string; label: string; kind: 'rock'|'non-rock'; group: string; source: string; license: string }> }} manifest
 * @returns {{ version: 1; embeddingDimension: number; items: Array<{ id: string; label: string; kind: 'rock'|'non-rock'; group: string; source: string; license: string; embedding: number[] }> }}
 */
function generateIndexFromManifest(manifest) {
  assertIsObject(manifest, 'Manifest must be an object.');
  if (manifest.version !== 1) throw new Error('Manifest version must be 1.');

  const dimension = assertPositiveInteger(manifest.embeddingDimension, 'Manifest embeddingDimension must be a positive integer.');
  if (!Array.isArray(manifest.items) || manifest.items.length === 0) {
    throw new Error('Manifest items must be a non-empty array.');
  }

  const items = manifest.items.map((item) => {
    assertIsObject(item, 'Manifest item must be an object.');
    const label = assertNonEmptyString(item.label, 'Manifest item label must be a non-empty string.');
    const embedding = normalizeVector(oneHot(dimension, positionForLabel(label, dimension)));

    return {
      id: assertNonEmptyString(item.id, 'Manifest item id must be a non-empty string.'),
      label,
      kind: assertKind(item.kind),
      group: assertNonEmptyString(item.group, 'Manifest item group must be a non-empty string.'),
      source: assertNonEmptyString(item.source, 'Manifest item source must be a non-empty string.'),
      license: assertNonEmptyString(item.license, 'Manifest item license must be a non-empty string.'),
      embedding,
    };
  });

  return {
    version: 1,
    embeddingDimension: dimension,
    items,
  };
}

/**
 * Validates a generated index payload.
 * @param {{ version: 1; embeddingDimension: number; items: Array<{ id: string; embedding: number[] }> }} index
 */
function validateIndex(index) {
  assertIsObject(index, 'Index must be an object.');
  if (index.version !== 1) throw new Error('Index version must be 1.');
  const dimension = assertPositiveInteger(index.embeddingDimension, 'Index embeddingDimension must be a positive integer.');
  if (!Array.isArray(index.items) || index.items.length === 0) throw new Error('Index items must be a non-empty array.');

  for (const item of index.items) {
    assertIsObject(item, 'Index item must be an object.');
    assertNonEmptyString(item.id, 'Index item id must be a non-empty string.');
    if (!Array.isArray(item.embedding) || item.embedding.length !== dimension) {
      throw new Error(`Index embedding dimension mismatch for ${item.id}.`);
    }
    for (const value of item.embedding) {
      if (typeof value !== 'number' || !Number.isFinite(value)) {
        throw new Error(`Index embedding values must be finite numbers for ${item.id}.`);
      }
    }
  }
}

/**
 * Creates a one-hot vector.
 * @param {number} dimension
 * @param {number} index
 * @returns {number[]}
 */
function oneHot(dimension, index) {
  return Array.from({ length: dimension }, (_, position) => (position === index ? 1 : 0));
}

/**
 * Normalizes a vector to unit length.
 * @param {number[]} vector
 * @returns {number[]}
 */
function normalizeVector(vector) {
  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  if (magnitude === 0) throw new Error('Vector magnitude must be non-zero.');
  return vector.map((value) => value / magnitude);
}

/**
 * Returns a stable one-hot position for known labels (demo), with a fallback hash.
 * @param {string} label
 * @param {number} dimension
 * @returns {number}
 */
function positionForLabel(label, dimension) {
  const known = {
    Granite: 0,
    Basalt: 1,
    Slag: 2,
    Obsidian: 3,
  };

  if (Object.prototype.hasOwnProperty.call(known, label)) {
    return known[label] % dimension;
  }

  return hashString(label) % dimension;
}

/**
 * Hashes a string into a stable non-negative integer.
 * @param {string} value
 * @returns {number}
 */
function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * Ensures a value is a non-empty string.
 * @param {unknown} value
 * @param {string} message
 * @returns {string}
 */
function assertNonEmptyString(value, message) {
  if (typeof value !== 'string' || value.trim().length === 0) throw new Error(message);
  return value;
}

/**
 * Ensures a value is an object (not an array).
 * @param {unknown} value
 * @param {string} message
 */
function assertIsObject(value, message) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(message);
}

/**
 * Ensures a value is a positive integer.
 * @param {unknown} value
 * @param {string} message
 * @returns {number}
 */
function assertPositiveInteger(value, message) {
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) throw new Error(message);
  return value;
}

/**
 * Ensures a value is a valid kind.
 * @param {unknown} value
 * @returns {'rock'|'non-rock'}
 */
function assertKind(value) {
  if (value === 'rock' || value === 'non-rock') return value;
  throw new Error("Manifest item kind must be 'rock' or 'non-rock'.");
}

const { manifest, out } = parseArgs(process.argv.slice(2));

const manifestRaw = await readFile(manifest, 'utf8');
const manifestJson = JSON.parse(manifestRaw);
const clipIndex = generateIndexFromManifest(manifestJson);
validateIndex(clipIndex);

await writeFile(out, JSON.stringify(clipIndex, null, 2) + '\n', 'utf8');

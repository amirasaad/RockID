import { readFile } from 'node:fs/promises';

export type ClipIndexItem = {
  id: string;
  label: string;
  kind: 'rock' | 'non-rock';
  group: string;
  source: string;
  license: string;
  embedding: number[];
};

export type ClipIndex = {
  version: 1;
  embeddingDimension: number;
  items: ClipIndexItem[];
};

/**
 * Loads a CLIP index artifact from disk and validates its shape.
 * @param relativePath - Path relative to the repository root.
 * @returns Parsed and validated CLIP index.
 */
export async function loadClipIndexFromFile(relativePath: string): Promise<ClipIndex> {
  const raw = await readFile(relativePath, 'utf8');
  const parsed = JSON.parse(raw) as unknown;
  return parseClipIndex(parsed);
}

/**
 * Parses and validates a CLIP index payload.
 * @param value - Untrusted input value (typically JSON-parsed).
 * @returns Parsed CLIP index.
 */
export function parseClipIndex(value: unknown): ClipIndex {
  const record = asRecord(value, 'Clip index must be an object.');
  const version = record.version;
  if (version !== 1) {
    throw new Error('Clip index version must be 1.');
  }

  const embeddingDimension = asPositiveInteger(record.embeddingDimension, 'Clip index embeddingDimension must be a positive integer.');
  const items = asArray(record.items, 'Clip index items must be an array.').map((item) =>
    parseClipIndexItem(item, embeddingDimension)
  );

  if (items.length === 0) {
    throw new Error('Clip index must contain at least one item.');
  }

  return {
    version: 1,
    embeddingDimension,
    items,
  };
}

/**
 * Parses and validates a CLIP index item.
 * @param value - Untrusted item value.
 * @param embeddingDimension - Expected embedding dimension.
 * @returns Parsed item.
 */
function parseClipIndexItem(value: unknown, embeddingDimension: number): ClipIndexItem {
  const record = asRecord(value, 'Clip index item must be an object.');

  const id = asNonEmptyString(record.id, 'Clip index item id must be a non-empty string.');
  const label = asNonEmptyString(record.label, 'Clip index item label must be a non-empty string.');
  const kind = asKind(record.kind);
  const group = asNonEmptyString(record.group, 'Clip index item group must be a non-empty string.');
  const source = asNonEmptyString(record.source, 'Clip index item source must be a non-empty string.');
  const license = asNonEmptyString(record.license, 'Clip index item license must be a non-empty string.');

  const embedding = asArray(record.embedding, 'Clip index item embedding must be an array.').map((entry) => asFiniteNumber(entry));
  if (embedding.length !== embeddingDimension) {
    throw new Error(`Clip index embedding dimension mismatch: expected ${embeddingDimension}, got ${embedding.length} for ${id}.`);
  }

  return {
    id,
    label,
    kind,
    group,
    source,
    license,
    embedding,
  };
}

/**
 * Ensures the value is a record-like object.
 * @param value - Candidate value.
 * @param message - Error message when validation fails.
 * @returns Record of unknown values.
 */
function asRecord(value: unknown, message: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(message);
  }
  return value as Record<string, unknown>;
}

/**
 * Ensures the value is an array.
 * @param value - Candidate value.
 * @param message - Error message when validation fails.
 * @returns Array of unknown values.
 */
function asArray(value: unknown, message: string): unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(message);
  }
  return value;
}

/**
 * Ensures the value is a non-empty string.
 * @param value - Candidate value.
 * @param message - Error message when validation fails.
 * @returns Validated string.
 */
function asNonEmptyString(value: unknown, message: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(message);
  }
  return value;
}

/**
 * Ensures the value is a positive integer.
 * @param value - Candidate value.
 * @param message - Error message when validation fails.
 * @returns Validated integer.
 */
function asPositiveInteger(value: unknown, message: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    throw new Error(message);
  }
  return value;
}

/**
 * Ensures the value is a finite number.
 * @param value - Candidate value.
 * @returns Validated number.
 */
function asFiniteNumber(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error('Clip index embedding values must be finite numbers.');
  }
  return value;
}

/**
 * Ensures the value is a valid kind.
 * @param value - Candidate kind.
 * @returns Valid kind.
 */
function asKind(value: unknown): ClipIndexItem['kind'] {
  if (value === 'rock' || value === 'non-rock') {
    return value;
  }
  throw new Error("Clip index item kind must be 'rock' or 'non-rock'.");
}


import { readFile } from 'node:fs/promises';

import { parseClipIndex, type ClipIndex } from './clip-index';

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


import { readFile } from 'node:fs/promises';

/**
 * Reads a commit message file and returns the first non-empty line.
 * @param {string} commitMsgFilePath - Path to the commit message file provided by git.
 * @returns {Promise<string>} The first non-empty line, or an empty string if none exists.
 */
async function readHeaderLine(commitMsgFilePath) {
  const raw = await readFile(commitMsgFilePath, 'utf8');
  const lines = raw.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length > 0) return trimmed;
  }
  return '';
}

/**
 * Determines whether a commit header should skip validation (e.g. merge commits).
 * @param {string} header - The commit header line.
 * @returns {boolean} True if the header should skip validation.
 */
function shouldSkip(header) {
  return header.startsWith('Merge ') || header.startsWith('Revert ');
}

/**
 * Validates that the commit header begins with a gitmoji emoji followed by whitespace.
 * @param {string} header - The commit header line.
 * @throws {Error} If the header is missing the required gitmoji prefix.
 */
function assertGitmojiPrefix(header) {
  const pattern = /^\p{Extended_Pictographic}+\s+/u;
  if (!pattern.test(header)) {
    throw new Error('Commit message must start with a gitmoji emoji followed by a space, e.g. "✨ feat: add X".');
  }
}

const commitMsgFilePath = process.argv[2];
if (!commitMsgFilePath) {
  process.stderr.write('Missing commit message file path argument.\n');
  process.exit(2);
}

const header = await readHeaderLine(commitMsgFilePath);
if (header && !shouldSkip(header)) {
  assertGitmojiPrefix(header);
}


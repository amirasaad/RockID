import { readFile } from 'node:fs/promises';

const SUPPORTED_TYPES_BY_EMOJI = new Map([
  ['feat', '✨'],
  ['fix', '🐛'],
  ['docs', '📝'],
  ['style', '🎨'],
  ['refactor', '📦'],
  ['perf', '🚀'],
  ['test', '🧪'],
  ['build', '👷'],
  ['ci', '♻️'],
  ['chore', '✏️'],
  ['revert', '⏪'],
  ['test-fail', '🧪'],
  ['agile', '📋'],
  ['bump', '🔖'],
  ['qa', '✅'],
  ['spike', '🧐'],
  ['config', '🔧'],
]);

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
  const pattern = /^(?:\p{Extended_Pictographic}|\p{Emoji_Modifier}|\uFE0F|\u200D)+\s+/u;
  if (!pattern.test(header)) {
    throw new Error('Commit message must start with a gitmoji emoji followed by a space, e.g. "✨ feat: add X".');
  }
}

/**
 * Parses a conventional gitmoji header.
 * @param {string} header
 * @returns {{ emoji: string, type: string, scope?: string, subject: string }}
 */
function parseHeader(header) {
  const match = header.match(/^(\S+)\s+([\w-]+)(?:\(([^)]+)\))?!?:\s+(.+)$/u);
  if (!match) {
    throw new Error('Commit message must follow "<emoji> <type>(<scope>): <subject>", e.g. "✨ feat(results): add CTA".');
  }

  return {
    emoji: stripVariationSelector(match[1]),
    type: match[2],
    scope: match[3],
    subject: match[4],
  };
}

/**
 * Validates the RockID commit rhythm type and emoji pairing.
 * @param {string} header
 */
function assertSupportedTypeEmojiPair(header) {
  const { emoji, type } = parseHeader(header);
  const expectedEmoji = SUPPORTED_TYPES_BY_EMOJI.get(type);

  if (emoji === '🔖' && type !== 'bump') {
    throw new Error('release bump must use bump.');
  }

  if (!expectedEmoji) {
    throw new Error(`Commit type "${type}" is not supported by the RockID commit rhythm.`);
  }

  if (stripVariationSelector(expectedEmoji) !== emoji) {
    throw new Error(`Commit type "${type}" must use ${expectedEmoji}.`);
  }
}

/**
 * Normalizes emoji strings that may include a variation selector.
 * @param {string} emoji
 * @returns {string}
 */
function stripVariationSelector(emoji) {
  return emoji.replace(/\uFE0F/g, '');
}

const commitMsgFilePath = process.argv[2];
if (!commitMsgFilePath) {
  process.stderr.write('Missing commit message file path argument.\n');
  process.exit(2);
}

try {
  const header = await readHeaderLine(commitMsgFilePath);
  if (header && !shouldSkip(header)) {
    assertGitmojiPrefix(header);
    assertSupportedTypeEmojiPair(header);
  }
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
}

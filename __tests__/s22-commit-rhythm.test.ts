import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);

const verifierPath = join(process.cwd(), 'scripts/verify-commit-msg.mjs');

describe('Sprint 22 commit rhythm', () => {
  it.each<[string]>([
    ['✨ feat(results): add low-confidence add-photo CTA'],
    ['🧪 test-fail(results): cover low-confidence add-photo CTA'],
    ['📋 agile(s22): move story to review'],
    ['🔖 bump(release): v0.24.0'],
    ['✅ qa(s22): record iphone and web smoke evidence'],
    ['🧐 spike(android): inspect dev build blockers'],
    ['🔧 config(commit): extend commitizen rhythm types'],
  ])('accepts %s', (header) => {
    expect(() => verifyHeader(header)).not.toThrow();
  });

  it.each([
    ['🧪 feat(results): add failing acceptance test', 'Commit type "feat" must use ✨'],
    ['✨ test-fail(results): cover missing flow', 'Commit type "test-fail" must use 🧪'],
    ['📝 agile(s22): update kanban', 'Commit type "agile" must use 📋'],
    ['🔖 chore(release): v0.24.0', 'release bump must use bump'],
    ['✨ nope(scope): add unknown type', 'Commit type "nope" is not supported'],
  ])('rejects %s', (header, expectedMessage) => {
    expect(() => verifyHeader(header)).toThrow(expectedMessage);
  });

  it('parses hyphenated rhythm types through commitlint config', () => {
    const commitlintConfig = require('../commitlint.config.cjs');
    const pattern = commitlintConfig.parserPreset.parserOpts.headerPattern as RegExp;

    const match = '🧪 test-fail(results): cover low-confidence add-photo CTA'.match(pattern);

    expect(match?.[2]).toBe('test-fail');
    expect(commitlintConfig.rules['type-enum'][2]).toContain('test-fail');
  });

  it('exposes RockID rhythm types in the local Commitizen adapter', () => {
    const { ROCKID_COMMIT_TYPES } = require('../scripts/rockid-commitizen.cjs');

    expect(ROCKID_COMMIT_TYPES).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'test-fail', emoji: '🧪' }),
        expect.objectContaining({ type: 'agile', emoji: '📋' }),
        expect.objectContaining({ type: 'bump', emoji: '🔖' }),
        expect.objectContaining({ type: 'qa', emoji: '✅' }),
        expect.objectContaining({ type: 'spike', emoji: '🧐' }),
        expect.objectContaining({ type: 'config', emoji: '🔧' }),
      ]),
    );
  });
});

function verifyHeader(header: string) {
  const dir = mkdtempSync(join(tmpdir(), 'rockid-commit-msg-'));
  const file = join(dir, 'COMMIT_EDITMSG');
  writeFileSync(file, `${header}\n`);

  try {
    try {
      execFileSync('node', [verifierPath, file], { encoding: 'utf8', stdio: 'pipe' });
    } catch (error) {
      const failure = error as { message?: string; stderr?: Buffer | string };
      const stderr = Buffer.isBuffer(failure.stderr) ? failure.stderr.toString('utf8') : (failure.stderr ?? '');
      throw new Error(`${stderr}${failure.message ?? ''}`);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

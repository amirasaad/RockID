import { execFileSync } from 'node:child_process';

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

function tryGit(args) {
  try {
    return git(args);
  } catch {
    return '';
  }
}

function getCurrentBranch() {
  return tryGit(['branch', '--show-current']);
}

function listMergedLocalBranches(baseRef) {
  const raw = tryGit(['for-each-ref', '--format=%(refname:short)', `--merged=${baseRef}`, 'refs/heads']);
  if (!raw) return [];
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function isProtectedBranch(branch, currentBranch) {
  if (branch === currentBranch) return true;
  if (branch === 'main') return true;
  if (branch === 'master') return true;
  if (branch === 'develop') return true;

  const currentIsMain = currentBranch === 'main';
  const currentIsSprint = currentBranch.startsWith('sprint/') || currentBranch.startsWith('sprint-');

  if (currentIsMain) {
    return false;
  }

  if (currentIsSprint) {
    return branch.startsWith('sprint/') || branch.startsWith('sprint-');
  }

  return false;
}

function deleteBranch(branch) {
  execFileSync('git', ['branch', '-d', branch], { stdio: 'pipe' });
}

function main() {
  const baseRef = process.argv[2] ?? 'HEAD';
  const currentBranch = getCurrentBranch();
  if (!currentBranch) return;

  const merged = listMergedLocalBranches(baseRef);
  const candidates = merged.filter((branch) => !isProtectedBranch(branch, currentBranch));
  if (candidates.length === 0) return;

  const deleted = [];
  const skipped = [];

  for (const branch of candidates) {
    try {
      deleteBranch(branch);
      deleted.push(branch);
    } catch {
      skipped.push(branch);
    }
  }

  if (deleted.length > 0) {
    process.stdout.write(`Deleted merged branches (${currentBranch}): ${deleted.join(', ')}\n`);
  }
  if (skipped.length > 0) {
    process.stdout.write(`Skipped merged branches (${currentBranch}): ${skipped.join(', ')}\n`);
  }
}

main();

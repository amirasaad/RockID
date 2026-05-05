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

async function readDisplayTypes() {
  try {
    const config = await import(new URL('../changelog.config.js', import.meta.url));
    const displayTypes = config?.default?.displayTypes ?? config?.displayTypes;
    if (Array.isArray(displayTypes) && displayTypes.every((type) => typeof type === 'string')) {
      return displayTypes;
    }
  } catch {
    return ['feat', 'fix', 'perf'];
  }

  return ['feat', 'fix', 'perf'];
}

function parseType(subject) {
  const match = subject.match(/^\S+\s+([\w-]+)(?:\([^)]+\))?!?:\s+/u);
  return match?.[1] ?? '';
}

async function main() {
  const currentBranch = tryGit(['branch', '--show-current']);
  if (!currentBranch) process.exit(1);

  const displayTypes = await readDisplayTypes();
  const lastTag = tryGit(['describe', '--tags', '--abbrev=0']);

  const range = lastTag ? `${lastTag}..HEAD` : 'HEAD';
  const rawSubjects = tryGit(['log', '--format=%s', range]);
  if (!rawSubjects) process.exit(1);

  const subjects = rawSubjects
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const relevant = subjects.filter((subject) => displayTypes.includes(parseType(subject)));
  if (relevant.length === 0) {
    process.stdout.write(`Skipping bump on ${currentBranch}: no ${displayTypes.join('/')} commits since ${lastTag || 'repo start'}.\n`);
    process.exit(1);
  }

  process.stdout.write(`Auto bump eligible on ${currentBranch}: ${relevant.length} ${displayTypes.join('/')} commit(s) since ${lastTag || 'repo start'}.\n`);
  process.exit(0);
}

main();

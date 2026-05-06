import { existsSync } from 'node:fs';
import { delimiter, join } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';

const REQUIRED_JAVA_MAJOR = 17;

function parseJavaMajor(rawVersion) {
  const match = rawVersion.match(/version "(?<version>\d+)(?:\.|")/u);
  return match?.groups?.version ? Number(match.groups.version) : null;
}

function readJavaMajor(env = process.env) {
  const result = spawnSync('java', ['-version'], { encoding: 'utf8', env });
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
  return parseJavaMajor(output);
}

function readJavaHomeMajor(javaHome) {
  const javaBinary = join(javaHome, 'bin', process.platform === 'win32' ? 'java.exe' : 'java');
  if (!existsSync(javaBinary)) return null;

  const result = spawnSync(javaBinary, ['-version'], { encoding: 'utf8' });
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
  return parseJavaMajor(output);
}

function isRequiredJavaHome(javaHome) {
  return readJavaHomeMajor(javaHome) === REQUIRED_JAVA_MAJOR;
}

function parseJavaHomeCandidates(rawOutput) {
  return rawOutput
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.match(/(?<path>\/.*\/Contents\/Home)$/u)?.groups?.path ?? line)
    .filter((line) => line.startsWith('/'));
}

function findMacJavaHome(major) {
  const javaHomeTool = '/usr/libexec/java_home';
  if (process.platform !== 'darwin' || !existsSync(javaHomeTool)) return null;

  const result = spawnSync(javaHomeTool, ['-v', String(major)], { encoding: 'utf8' });
  const directCandidate = result.stdout.trim();
  if (result.status === 0 && directCandidate && isRequiredJavaHome(directCandidate)) {
    return directCandidate;
  }

  const listResult = spawnSync(javaHomeTool, ['-V'], { encoding: 'utf8' });
  const candidates = parseJavaHomeCandidates(`${listResult.stdout ?? ''}${listResult.stderr ?? ''}`);
  return candidates.find(isRequiredJavaHome) ?? null;
}

function resolveJavaHome() {
  const override = process.env.ROCKID_ANDROID_JAVA_HOME;
  if (override) return isRequiredJavaHome(override) ? override : null;

  const currentJavaHome = process.env.JAVA_HOME;
  if (currentJavaHome && isRequiredJavaHome(currentJavaHome)) return currentJavaHome;

  return findMacJavaHome(REQUIRED_JAVA_MAJOR);
}

function buildAndroidEnv() {
  const javaHome = resolveJavaHome();
  if (!javaHome) {
    const activeMajor = readJavaMajor();
    console.error(`RockID Android builds require JDK ${REQUIRED_JAVA_MAJOR}. Active Java major: ${activeMajor ?? 'unknown'}.`);
    console.error('Install JDK 17, set JAVA_HOME to it, or set ROCKID_ANDROID_JAVA_HOME before running pnpm android.');
    process.exit(1);
  }

  const env = { ...process.env, JAVA_HOME: javaHome };
  env.PATH = `${javaHome}/bin${delimiter}${process.env.PATH ?? ''}`;
  const major = readJavaMajor(env);
  if (major !== REQUIRED_JAVA_MAJOR) {
    console.error(`RockID Android builds require JDK ${REQUIRED_JAVA_MAJOR}, but resolved JAVA_HOME reports Java ${major ?? 'unknown'}.`);
    console.error(`Resolved JAVA_HOME: ${javaHome}`);
    process.exit(1);
  }

  return env;
}

const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const child = spawn(pnpmCommand, ['exec', 'expo', 'run:android', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: buildAndroidEnv(),
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});

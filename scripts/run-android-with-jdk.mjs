import { existsSync } from 'node:fs';
import { delimiter } from 'node:path';
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

function findMacJavaHome(major) {
  const javaHomeTool = '/usr/libexec/java_home';
  if (process.platform !== 'darwin' || !existsSync(javaHomeTool)) return null;

  const result = spawnSync(javaHomeTool, ['-v', String(major)], { encoding: 'utf8' });
  if (result.status !== 0) return null;

  return result.stdout.trim() || null;
}

function resolveJavaHome() {
  const override = process.env.ROCKID_ANDROID_JAVA_HOME;
  if (override) return override;

  const activeMajor = readJavaMajor();
  if (activeMajor === REQUIRED_JAVA_MAJOR) return process.env.JAVA_HOME ?? null;

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

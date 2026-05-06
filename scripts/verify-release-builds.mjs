import { rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const outputRoot = join(tmpdir(), 'rockid-release-builds');

const steps = [
  {
    label: 'iOS JS bundle export',
    args: ['exec', 'expo', 'export', '--platform', 'ios', '--output-dir', join(outputRoot, 'ios-export')],
  },
  {
    label: 'Android JS bundle export',
    args: ['exec', 'expo', 'export', '--platform', 'android', '--output-dir', join(outputRoot, 'android-export')],
  },
  {
    label: 'iOS native build',
    args: ['exec', 'expo', 'run:ios', '--no-install', '--no-bundler'],
  },
  {
    label: 'Android native build',
    args: ['run', 'android', '--', '--no-install', '--no-bundler'],
  },
];

function runStep(step) {
  console.log(`\n==> ${step.label}`);
  const result = spawnSync(pnpmCommand, step.args, {
    stdio: 'inherit',
    env: process.env,
  });

  if (result.status !== 0) {
    console.error(`\nRelease build gate failed: ${step.label}`);
    process.exit(result.status ?? 1);
  }
}

rmSync(outputRoot, { recursive: true, force: true });

for (const step of steps) {
  runStep(step);
}

console.log('\nRelease build gate passed: iOS and Android bundle/native builds succeeded.');

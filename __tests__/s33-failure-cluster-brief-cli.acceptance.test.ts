import { describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

describe('S33 failure cluster brief CLI acceptance', () => {
  it('prints deterministic top-cluster brief lines from report json', () => {
    const dir = mkdtempSync(join(tmpdir(), 'rockid-s33-brief-'));

    try {
      const reportPath = join(dir, 'report.json');
      writeFileSync(
        reportPath,
        JSON.stringify(
          {
            topConfusions: [
              { expected: 'Glass', predicted: 'Granite', count: 3, sampleIds: ['g-2', 'g-1', 'g-3'] },
              { expected: 'Asphalt', predicted: 'Basalt', count: 2, sampleIds: ['a-2', 'a-1'] },
            ],
            confusionPairs: [],
          },
          null,
          2
        )
      );

      const result = spawnSync('node', ['scripts/print-failure-cluster-brief.mjs', '--report', reportPath, '--max-clusters', '2', '--max-samples', '2'], {
        cwd: process.cwd(),
        encoding: 'utf8',
      });

      expect(result.status).toBe(0);
      expect(result.stdout.trim()).toBe('1. Glass → Granite (3) [g-1, g-2 ... (+1 more)]\n2. Asphalt → Basalt (2) [a-1, a-2]');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

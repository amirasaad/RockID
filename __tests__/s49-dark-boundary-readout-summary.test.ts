import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const repoRoot = resolve(__dirname, '..');

describe('S49 dark-boundary readout summary', () => {
  it('keeps the dark-boundary arc tied to the S46-S48 evidence chain', () => {
    const summary = readDoc('docs/detection/Sprint-49-Dark-Boundary-Readout-Summary.md');

    expect(summary).toContain('Sprint 46');
    expect(summary).toContain('Sprint 47');
    expect(summary).toContain('Sprint 48');
    expect(summary).toContain('zero high-confidence rock claims');
    expect(summary).toContain('No production behavior change');
    expect(summary).toContain('real known-answer dark-confuser photo');
  });

  it('does not remove the S46-S48 readouts from standing eval gates', () => {
    const packageJson = readDoc('package.json');

    for (const readout of [
      '__tests__/s46-basalt-boundary-readout.test.ts',
      '__tests__/s47-asphalt-boundary-readout.test.ts',
      '__tests__/s48-coal-boundary-readout.test.ts',
    ]) {
      expect(packageJson).toContain(readout);
    }
  });
});

function readDoc(relativePath: string): string {
  return readFileSync(resolve(repoRoot, relativePath), 'utf8');
}

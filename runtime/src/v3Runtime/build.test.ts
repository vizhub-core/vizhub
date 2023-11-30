import { describe, it, expect } from 'vitest';
import { rollup } from 'rollup';
import { build } from './build';

describe('v3 build', () => {
  it('Should not crash when missing files', async () => {
    const files = {};

    const buildResult = await build({ files, rollup });

    expect(buildResult).toBeDefined();

    expect(buildResult).toBeDefined();
    expect(buildResult.errors).toEqual([
      {
        code: 'MISSING_INDEX_JS',
        message: 'Missing index.js',
      },
    ]);
    expect(buildResult.warnings).toEqual([
      {
        code: 'MISSING_PACKAGE_JSON',
        message: 'Missing package.json',
      },
    ]);
    expect(buildResult.src).toBeUndefined();
    expect(buildResult.pkg).toBeUndefined();
  });

  // TODO add tests for success cases
});

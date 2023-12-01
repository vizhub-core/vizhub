import { describe, it, expect } from 'vitest';
import { rollup } from 'rollup';
import { build } from './build';
import { Content } from 'entities';
import { createVizCache } from './vizCache';

describe('v3 build', () => {
  it('Should not crash when missing files', async () => {
    const buildResult = await build({
      vizId: 'test-viz',
      rollup,
      vizCache: createVizCache({
        initialContents: [
          {
            id: 'test-viz',

            // This test is mainly testing the case
            // where this is empty.
            files: {},

            title: 'Test Viz',
          },
        ],
        handleCacheMiss: async () => {
          throw new Error('Not implemented');
        },
      }),
    });

    expect(buildResult).toBeDefined();

    expect(buildResult).toBeDefined();
    expect(buildResult.errors).toEqual([
      {
        code: 'MISSING_INDEX_JS',
        message: 'Missing index.js',
      },
    ]);
    // expect(buildResult.warnings).toEqual([
    //   {
    //     code: 'MISSING_PACKAGE_JSON',
    //     message: 'Missing package.json',
    //   },
    // ]);
    expect(buildResult.src).toBeUndefined();
    expect(buildResult.pkg).toBeUndefined();
  });

  // TODO add tests for success cases
});

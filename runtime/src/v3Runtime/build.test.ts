import { describe, it, expect, vi } from 'vitest';
import { rollup } from 'rollup';
import { build } from './build';
import { createVizCache } from './vizCache';
import {
  sampleContent,
  sampleContentWithCSS,
  sampleContentVizImport,
  sampleContentVizImportWithCSS,
  sampleContentWithCSV,
  sampleContentVizImportMissing,
} from 'entities/test/fixtures';

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
    expect(buildResult.src).toBeUndefined();
    expect(buildResult.pkg).toBeUndefined();
  });

  it('Should build successfully with valid inputs', async () => {
    const vizCache = createVizCache({
      initialContents: [sampleContent],
      handleCacheMiss: vi.fn(),
    });
    const buildResult = await build({
      vizId: sampleContent.id,
      rollup,
      vizCache,
    });
    expect(vi.fn()).toHaveBeenCalledTimes(0);

    expect(buildResult).toBeDefined();
    expect(buildResult.errors).toHaveLength(0);
    expect(buildResult.warnings).toHaveLength(0);
    expect(buildResult.cssFiles).toHaveLength(0);
    expect(buildResult.src).toBeDefined();
    expect(buildResult.time).toBeDefined();
    expect(buildResult.pkg).toBeUndefined();

    expect(buildResult.src).toContain(
      `const innerMessage = "Inner";`,
    );
    expect(buildResult.src).toContain(
      `const message = "Outer " + innerMessage;`,
    );
  });

  it('Should build successfully with css imports', async () => {
    const vizCache = createVizCache({
      initialContents: [sampleContentWithCSS],
      handleCacheMiss: vi.fn(),
    });
    const buildResult = await build({
      vizId: sampleContentWithCSS.id,
      rollup,
      vizCache,
    });
    expect(vi.fn()).toHaveBeenCalledTimes(0);

    // console.log(JSON.stringify(buildResult, null, 2));

    expect(buildResult).toBeDefined();
    expect(buildResult.errors).toHaveLength(0);
    expect(buildResult.warnings).toHaveLength(1);
    expect(buildResult.cssFiles).toHaveLength(1);
    expect(buildResult.src).toBeDefined();
    expect(buildResult.time).toBeDefined();
    expect(buildResult.pkg).toBeUndefined();

    expect(buildResult.warnings[0].code).toBe(
      'EMPTY_BUNDLE',
    );
    expect(buildResult.cssFiles[0]).toBe(
      'sample-content-with-css/styles.css',
    );
  });

  it('Should build successfully with csv imports', async () => {
    const vizCache = createVizCache({
      initialContents: [sampleContentWithCSV],
      handleCacheMiss: vi.fn(),
    });
    const buildResult = await build({
      vizId: sampleContentWithCSV.id,
      rollup,
      vizCache,
    });
    expect(vi.fn()).toHaveBeenCalledTimes(0);

    console.log(JSON.stringify(buildResult, null, 2));

    expect(buildResult).toBeDefined();
    expect(buildResult.errors).toHaveLength(0);
    expect(buildResult.warnings).toHaveLength(0);
    expect(buildResult.cssFiles).toHaveLength(0);
    expect(buildResult.src).toBeDefined();
    expect(buildResult.time).toBeDefined();
    expect(buildResult.pkg).toBeUndefined();

    expect(buildResult.src).toContain('sepal.width');
  });

  it('Import from viz: should build successfully with valid inputs', async () => {
    const vizCache = createVizCache({
      initialContents: [
        sampleContent,
        sampleContentVizImport,
      ],
      handleCacheMiss: vi.fn(),
    });
    const buildResult = await build({
      vizId: sampleContentVizImport.id,
      rollup,
      vizCache,
    });

    // console.log(JSON.stringify(buildResult, null, 2));

    expect(vi.fn()).toHaveBeenCalledTimes(0);

    expect(buildResult).toBeDefined();
    expect(buildResult.errors).toHaveLength(0);
    expect(buildResult.warnings).toHaveLength(0);
    expect(buildResult.cssFiles).toHaveLength(0);
    expect(buildResult.src).toBeDefined();
    expect(buildResult.time).toBeDefined();
    expect(buildResult.pkg).toBeUndefined();

    expect(buildResult.src).toContain(
      `const innerMessage = "Inner";`,
    );
    expect(buildResult.src).toContain(
      `const message = "Outer " + innerMessage;`,
    );
    expect(buildResult.src).toContain(
      `const message2 = "Imported from viz: " + message;`,
    );
  });

  it('Import from viz: should build successfully with css imports', async () => {
    const vizCache = createVizCache({
      initialContents: [
        sampleContentWithCSS,
        sampleContentVizImportWithCSS,
      ],
      handleCacheMiss: vi.fn(),
    });
    const buildResult = await build({
      vizId: sampleContentVizImportWithCSS.id,
      rollup,
      vizCache,
    });
    expect(vi.fn()).toHaveBeenCalledTimes(0);

    // console.log(JSON.stringify(buildResult, null, 2));

    expect(buildResult).toBeDefined();
    expect(buildResult.errors).toHaveLength(0);
    expect(buildResult.warnings).toHaveLength(1);
    expect(buildResult.cssFiles).toHaveLength(1);
    expect(buildResult.src).toBeDefined();
    expect(buildResult.time).toBeDefined();
    expect(buildResult.pkg).toBeUndefined();

    expect(buildResult.warnings[0].code).toBe(
      'EMPTY_BUNDLE',
    );
    expect(buildResult.cssFiles[0]).toBe(
      'sample-content-with-css/styles.css',
    );
  });

  it('Import from viz: should error with unresolved import', async () => {
    const vizCache = createVizCache({
      initialContents: [
        // `sampleContent` not included, so the import will not resolve
        sampleContentVizImport,
      ],
      handleCacheMiss: async () => {
        throw new Error('Import not found');
      },
    });
    const buildResult = await build({
      vizId: sampleContentVizImport.id,
      rollup,
      vizCache,
    });

    // console.log(JSON.stringify(buildResult, null, 2));
    // buildResult
    // {
    //   "errors": [
    //     {
    //       "code": "PLUGIN_ERROR",
    //       "plugin": "vizLoadJS",
    //       "hook": "load",
    //       "name": "Error",
    //       "message": "Could not load foo/index.js (imported by sample-content-viz-import/index.js): Import not found"
    //     }
    //   ],
    //   "warnings": [],
    //   "cssFiles": [],
    //   "time": 11
    // }

    expect(buildResult).toBeDefined();
    expect(buildResult.errors).toHaveLength(1);
    expect(buildResult.errors[0].code).toBe('PLUGIN_ERROR');
    expect(buildResult.errors[0].plugin).toBe('vizLoadJS');
    expect(buildResult.errors[0].hook).toBe('load');
    expect(buildResult.errors[0].name).toBe('Error');
    expect(buildResult.errors[0].message).toBe(
      'Could not load foo/index.js (imported by sample-content-viz-import/index.js): Import not found',
    );
    expect(buildResult.warnings).toHaveLength(0);
    expect(buildResult.cssFiles).toHaveLength(0);
    expect(buildResult.src).toBeUndefined();
    expect(buildResult.time).toBeDefined();
    expect(buildResult.pkg).toBeUndefined();
  });
});

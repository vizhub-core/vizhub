import { describe, it, expect } from 'vitest';
import { compile } from 'svelte/compiler';
import { rollup } from 'rollup';
import { build } from './build';
import { createVizCache } from './vizCache';
import {
  sampleContent,
  sampleContentWithCSS,
  sampleContentVizImport,
  sampleContentVizImportWithCSS,
  sampleContentWithCSV,
  sampleContentVizImportSlug,
  sampleContentWithCSVStrangeCharacters,
  sampleContentSvelte,
} from 'entities/test/fixtures';
import { VizId } from 'entities';

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
      resolveSlug: () => {
        throw new Error('Not implemented');
      },
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
      handleCacheMiss: async () => {
        throw new Error('Not implemented');
      },
    });
    const buildResult = await build({
      vizId: sampleContent.id,
      rollup,
      vizCache,
      resolveSlug: () => {
        throw new Error('Not implemented');
      },
    });
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
      handleCacheMiss: async () => {
        throw new Error('Not implemented');
      },
    });
    const buildResult = await build({
      vizId: sampleContentWithCSS.id,
      rollup,
      vizCache,
      resolveSlug: () => {
        throw new Error('Not implemented');
      },
    });
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
      `${sampleContentWithCSS.id}/styles.css`,
    );
  });

  it('Should build successfully with csv imports', async () => {
    const vizCache = createVizCache({
      initialContents: [sampleContentWithCSV],
      handleCacheMiss: async () => {
        throw new Error('Not implemented');
      },
    });
    const buildResult = await build({
      vizId: sampleContentWithCSV.id,
      rollup,
      vizCache,
      resolveSlug: () => {
        throw new Error('Not implemented');
      },
    });

    // console.log(JSON.stringify(buildResult, null, 2));

    expect(buildResult).toBeDefined();
    expect(buildResult.errors).toHaveLength(0);
    expect(buildResult.warnings).toHaveLength(0);
    expect(buildResult.cssFiles).toHaveLength(0);
    expect(buildResult.src).toBeDefined();
    expect(buildResult.time).toBeDefined();
    expect(buildResult.pkg).toBeUndefined();

    expect(buildResult.src).toContain('sepal.width');
  });

  it('Should build successfully with csv imports, strange characters', async () => {
    const vizCache = createVizCache({
      initialContents: [
        sampleContentWithCSVStrangeCharacters,
      ],
      handleCacheMiss: async () => {
        throw new Error('Not implemented');
      },
    });
    const buildResult = await build({
      vizId: sampleContentWithCSVStrangeCharacters.id,
      rollup,
      vizCache,
      resolveSlug: () => {
        throw new Error('Not implemented');
      },
    });

    // console.log(JSON.stringify(buildResult, null, 2));

    expect(buildResult).toBeDefined();
    expect(buildResult.errors).toHaveLength(0);
    expect(buildResult.warnings).toHaveLength(0);
    expect(buildResult.cssFiles).toHaveLength(0);
    expect(buildResult.src).toBeDefined();
    expect(buildResult.time).toBeDefined();
    expect(buildResult.pkg).toBeUndefined();

    expect(buildResult.src).toContain('Germany');
  });

  it('Import from viz: should build successfully with valid inputs', async () => {
    const vizCache = createVizCache({
      initialContents: [
        sampleContent,
        sampleContentVizImport,
      ],
      handleCacheMiss: async () => {
        throw new Error('Not implemented');
      },
    });
    const buildResult = await build({
      vizId: sampleContentVizImport.id,
      rollup,
      vizCache,
      resolveSlug: () => {
        throw new Error('Not implemented');
      },
    });

    // console.log(JSON.stringify(buildResult, null, 2));

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
      handleCacheMiss: async () => {
        throw new Error('Not implemented');
      },
    });
    const buildResult = await build({
      vizId: sampleContentVizImportWithCSS.id,
      rollup,
      vizCache,
      resolveSlug: () => {
        throw new Error('Not implemented');
      },
    });

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
      `${sampleContentWithCSS.id}/styles.css`,
    );
  });

  it('Import from viz: should build successfully with slug-based import', async () => {
    const vizCache = createVizCache({
      initialContents: [
        sampleContent,
        sampleContentVizImportSlug,
      ],
      handleCacheMiss: async () => {
        throw new Error('Not implemented');
      },
    });
    const buildResult = await build({
      vizId: sampleContentVizImportSlug.id,
      rollup,
      vizCache,
      resolveSlug: async ({
        userName,
        slug,
      }): Promise<VizId> => {
        console.log(
          `Resolving ${userName}/${slug} to ${sampleContent.id}`,
        );
        return sampleContent.id;
      },
    });

    // console.log(JSON.stringify(buildResult, null, 2));

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

  it('Svelte: should build successfully with Svelte', async () => {
    const vizCache = createVizCache({
      initialContents: [sampleContentSvelte],
      handleCacheMiss: async () => {
        throw new Error('Not implemented');
      },
    });
    const buildResult = await build({
      vizId: sampleContentSvelte.id,
      rollup,
      vizCache,
      getSvelteCompiler: () => compile,
    });

    // console.log(JSON.stringify(buildResult, null, 2));
    console.log('buildResult.errors');
    console.log(buildResult.errors);
    console.log('buildResult.warnings');
    console.log(buildResult.warnings);
    console.log('buildResult.src');
    console.log(buildResult.src);

    expect(buildResult).toBeDefined();
    expect(buildResult.errors).toHaveLength(0);
    expect(buildResult.warnings).toHaveLength(0);
    expect(buildResult.cssFiles).toHaveLength(0);
    expect(buildResult.src).toBeDefined();
    expect(buildResult.time).toBeDefined();
    expect(buildResult.pkg).toBeUndefined();

    // expect(buildResult.src).toContain(
    //   `const innerMessage = "Inner";`,
    // );
    // expect(buildResult.src).toContain(
    //   `const message = "Outer " + innerMessage;`,
    // );
    // expect(buildResult.src).toContain(
    //   `const message2 = "Imported from viz: " + message;`,
    // );
  });
});

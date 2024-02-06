import { describe, it, expect } from 'vitest';
import { missingIndexJSError } from 'gateways';
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
import { missingImportError } from 'gateways/src/errors';

describe('v3 build', () => {
  it('Should throw an error when missing files', async () => {
    // Expect build to throw an error
    expect(async () => {
      await build({
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
    }).rejects.toThrow(missingIndexJSError());
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
    expect(buildResult.warnings).toHaveLength(0);
    expect(buildResult.cssFiles).toHaveLength(0);
    expect(buildResult.src).toBeDefined();
    expect(buildResult.time).toBeDefined();
    expect(buildResult.pkg).toBeUndefined();

    expect(buildResult.src).toContain('Türkiye');
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
      getSvelteCompiler: async () => compile,
    });

    // console.log(JSON.stringify(buildResult, null, 2));
    // console.log('buildResult.errors');
    // console.log(buildResult.errors);
    // console.log('buildResult.warnings');
    // console.log(buildResult.warnings);
    // console.log('buildResult.src');
    // console.log(buildResult.src);

    expect(buildResult).toBeDefined();
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

  it('Should throw an error when a package name import is missing', async () => {
    // Expect build to throw an error
    expect(async () => {
      await build({
        vizId: 'test-viz',
        rollup,
        vizCache: createVizCache({
          initialContents: [
            {
              id: 'test-viz',
              files: {
                '4325432': {
                  name: 'index.js',
                  text: 'import { message } from "missing-viz";\nconsole.log(message);',
                },
              },
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
    }).rejects.toThrow(
      missingImportError(
        `"missing-viz" is imported by "test-viz/index.js", but could not be resolved.`,
      ),
    );
  });

  it('Should throw an error when a local import is missing', async () => {
    // Expect build to throw an error
    expect(async () => {
      await build({
        vizId: 'test-viz',
        rollup,
        vizCache: createVizCache({
          initialContents: [
            {
              id: 'test-viz',
              files: {
                '4325432': {
                  name: 'index.js',
                  text: 'import { message } from "./missing";\nconsole.log(message);',
                },
              },
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
    }).rejects.toThrow(
      missingImportError(
        `Could not load test-viz/missing.js (imported by test-viz/index.js): Imported file "missing.js" not found.`,
      ),
    );
  });
  it('Should throw an error when a local import is missing', async () => {
    // Expect build to throw an error
    expect(async () => {
      await build({
        vizId: '7f0b69fcb754479699172d1887817027',
        rollup,
        vizCache: createVizCache({
          initialContents: [
            {
              id: '7f0b69fcb754479699172d1887817027',
              files: {
                '4325432': {
                  name: 'index.js',
                  text: 'import { message } from "./missing";\nconsole.log(message);',
                },
              },
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
    }).rejects.toThrow(
      missingImportError(
        `Could not load missing.js (imported by index.js): Imported file "missing.js" not found.`,
      ),
    );
  });

  // This is the error that fucked up the whole system
  // See
  // https://github.com/rollup/rollup/issues/5379
  it.skip('Should throw a syntax error properly', async () => {
    // Expect build to throw an error
    expect(async () => {
      await build({
        vizId: '7f0b69fcb754479699172d1887817027',
        rollup,
        vizCache: createVizCache({
          initialContents: [
            {
              id: '7f0b69fcb754479699172d1887817027',
              files: {
                '4325432': {
                  name: 'index.js',
                  text: `
                    const foo = {
                      bar = baz,
                    };
                    console.log(foo);
                 `,
                },
              },
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
    }).rejects.toThrow(
      missingImportError(
        `Could not load missing.js (imported by index.js): Imported file "missing.js" not found.`,
      ),
    );
  });

  // TODO test that covers invalidPackageJSONError
});

# @vizhub-core/runtime

The `@vizhub-core/runtime` package is a core component of the VizHub platform, responsible for executing and rendering visualizations in an isolated environment. It supports multiple runtime versions (V2 and V3) and provides a flexible system for handling dependencies, file transformations, and hot reloading.

## Features

- **Source code to HTML transformation**: Converts source code to HTML with embedded scripts and styles, ready for rendering in a browser.
- **File transformations**: Transforms various file types (e.g., JavaScript, CSS, CSV, Svelte) to be used in the runtime environment.
- **Hot reloading**: Automatically reloads visualizations when files are updated, providing a smooth development experience.
- **Dependency management**: Handles external dependencies via CDN and supports custom package configurations.
- **Virtual file system**: Implements a virtual file system for handling imports and file loading within the runtime.
- **Web Worker-based build system**: Uses Web Workers to offload the build process, ensuring a responsive UI during development.
- **Multi-version runtime support**: Supports both V2 and V3 runtime environments, allowing for backward compatibility and future-proofing.

## Installation

Install the package using npm:

```bash
npm install @vizhub-core/runtime
```

## Usage

The `@vizhub-core/runtime` package is designed to be used within the VizHub platform but can also be utilized in other environments where isolated execution of visualizations is required.

### Example

Here's an example of how to use the runtime to compute the `srcdoc` for a visualization:

```javascript
import { expect, test } from "vitest";
import { rollup } from "rollup";
import { computeSrcDoc, createVizCache, VizCache } from "@vizhub/runtime";

test("computeSrcDoc", async () => {
  const content = {
    files: {
      "32748932": {
        name: "index.js",
        text: "export const main = (container) => container.innerHTML = 'Hello, world!';",
      },
    },
  };

  const vizCache: VizCache = createVizCache({
    initialContents: [content],
    handleCacheMiss: async () => {
      return content;
    },
  });

  const resolveSlug = async (slug: string) => {
    throw new Error("Not implemented");
  };

  const getSvelteCompiler = async () => {
    throw new Error("Not implemented");
  };

  const { initialSrcdoc, initialSrcdocError } = await computeSrcDoc({
    rollup,
    content,
    vizCache,
    resolveSlug,
    getSvelteCompiler,
  });

  const randomID = initialSrcdoc.match(/viz-container-(\d+)/)?.[1];

  const srcdocWithoutMapping = initialSrcdoc.replace(
    /\/\/# sourceMappingURL=.*$/gm,
    ""
  );

  expect(srcdocWithoutMapping).toEqual(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body {
        margin: 0;
        overflow: hidden;
      }
      #viz-container-${randomID} {
        height: 100vh;
      }
    </style>
  </head>
  <body>
    <div id="viz-container-${randomID}"></div>
    <script id="injected-script">(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(exports):typeof define==='function'&&define.amd?define(['exports'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,f(g.Viz={}));})(this,(function(exports){'use strict';const main = (container) => container.innerHTML = 'Hello, world!';exports.main=main;}));


    <script>
      (() => {
        let cleanup;
        const render = () => {
          const container = document.getElementById('viz-container-${randomID}');
          typeof cleanup === 'function' && cleanup();
          cleanup = Viz.main(container, { state: window.state, setState, writeFile });
        };
        const setState = (next) => {
          window.state = next(window.state);
          render();
        };
        const writeFile = (fileName, content) => {
          parent.postMessage({ type: 'writeFile', fileName, content }, "*");
        };
        const run = () => {
          try {
            setState((state) => state || {});
          } catch (error) {
            console.error(error);
            parent.postMessage({ type: 'runError', error }, "*");
          }
        }
        run();
        const runJS = (src) => {
          document.getElementById('injected-script')?.remove();
          const script = document.createElement('script');
          script.textContent = src;
          script.id = 'injected-script';
          document.body.appendChild(script);
          run();
        };
        const runCSS = (src, id) => {
          const styleElementId = 'injected-style' + id;
          let style = document.getElementById(styleElementId);
          if (!style) {
            style = document.createElement('style');
            style.type = 'text/css';
            style.id = styleElementId;
            document.head.appendChild(style);
          }
          style.textContent = src;
        };
        onmessage = (message) => {
          switch (message.data.type) {
            case 'runJS':
              runJS(message.data.src);
              parent.postMessage({ type: 'runDone' }, "*");
              break;
            case 'runCSS':
              runCSS(message.data.src, message.data.id);
              break;
            case 'ping':
              parent.postMessage({ type: 'pong' }, "*");
              break;
            default:
              break;
          }
        }
      })();
    </script>
  </body>
</html>`);
});
```

You can use the generated HTML and run it as a standalone page or within an iframe to display the visualization.

## API Documentation

### `computeSrcDoc`

Computes the `srcdoc` for a visualization based on its content and dependencies.

#### Parameters

- **`rollup`**: The Rollup instance used for bundling.
- **`content`**: The content of the visualization, including files like `index.js` and `index.html`.
- **`vizCache`**: A cache of visualizations used to resolve imports from other visualizations.
- **`resolveSlug`**: A function to resolve slug-based imports to a viz ID.
- **`getSvelteCompiler`**: A function to get the Svelte compiler.

#### Returns

A promise that resolves to an object containing:

- **`initialSrcdoc`**: The computed `srcdoc` for the visualization.
- **`initialSrcdocError`**: Any error that occurred during the computation.

### `createVizCache`

Creates a cache for visualizations, used to resolve imports from other visualizations.

#### Parameters

- **`initialContents`**: An array of initial contents to populate the cache.
- **`handleCacheMiss`**: A function called when a visualization is not found in the cache.

#### Returns

A `VizCache` object with the following methods:

- **`get(vizId)`**: Retrieves the content of a visualization by its ID.
- **`set(content)`**: Adds or updates the content of a visualization in the cache.
- **`invalidate(vizId)`**: Invalidates the cache for a specific visualization.

### `setJSDOM`

Sets the DOM parser for environments where the native `DOMParser` is not available (e.g., Node.js).

#### Parameters

- **`JSDOM`**: The `JSDOM` instance to use for parsing HTML.

### `cleanRollupErrorMessage`

Cleans up Rollup error messages by removing unnecessary details like the viz ID.

#### Parameters

- **`rawMessage`**: The raw error message from Rollup.
- **`vizId`**: The ID of the visualization.

#### Returns

- A cleaned-up error message string.

## Development

To contribute to the development of this package, follow these steps:

### Clone the Repository

```bash
git clone https://github.com/vizhub-core/vizhub3.git
cd vizhub3
```

### Install Dependencies

```bash
npm install
```

### Run Tests

The package uses Vitest for testing. Run the tests with:

```bash
npm run test
```

### Build the Package

To build the package, use:

```bash
npm run build
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

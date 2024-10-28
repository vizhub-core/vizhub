# @vizhub-core/runtime

The `@vizhub-core/runtime` package is a core component of the VizHub platform, responsible for executing and rendering visualizations in an isolated environment. It supports multiple runtime versions (V2 and V3) and provides a flexible system for handling dependencies, file transformations, and hot reloading.

## Features

- **Multi-version runtime support**: Supports both V2 and V3 runtime environments, allowing for backward compatibility and future-proofing.
- **Hot reloading**: Automatically reloads visualizations when files are updated, providing a smooth development experience.
- **Dependency management**: Handles external dependencies via CDN and supports custom package configurations.
- **File transformations**: Transforms various file types (e.g., JavaScript, CSS, CSV, Svelte) to be used in the runtime environment.
- **Virtual file system**: Implements a virtual file system for handling imports and file loading within the runtime.
- **Web Worker-based build system**: Uses Web Workers to offload the build process, ensuring a responsive UI during development.

## Installation

To install the package, use npm:

\`\`\`
npm install @vizhub-core/runtime
\`\`\`

## Usage

The `@vizhub-core/runtime` package is designed to be used within the VizHub platform, but it can also be used in other environments where isolated execution of visualizations is required.

### Example

Here is an example of how to use the runtime to compute the `srcdoc` for a visualization:

\`\`\`typescript
import { computeSrcDoc } from '@vizhub-core/runtime';
import { rollup } from 'rollup';
import { createVizCache } from '@vizhub-core/runtime/v3Runtime/vizCache';

const vizCache = createVizCache({
initialContents: [],
handleCacheMiss: async (vizId) => {
// Fetch the content for the vizId
},
});

const content = {
id: 'example-viz',
files: {
'index.js': { name: 'index.js', text: 'console.log("Hello World");' },
'index.html': { name: 'index.html', text: '<html><body><h1>Hello World</h1></body></html>' },
},
};

const srcdoc = await computeSrcDoc({
rollup,
content,
vizCache,
resolveSlug: async ({ userName, slug }) => {
// Resolve slug to vizId
},
getSvelteCompiler: async () => {
// Return the Svelte compiler
},
});

console.log(srcdoc);
\`\`\`

## API Documentation

### `computeSrcDoc`

Computes the `srcdoc` for a visualization based on its content and dependencies.

#### Parameters:

- `rollup`: The Rollup instance used for bundling.
- `content`: The content of the visualization, including files like `index.js` and `index.html`.
- `vizCache`: A cache of visualizations used to resolve imports from other visualizations.
- `resolveSlug`: A function to resolve slug-based imports to a viz ID.
- `getSvelteCompiler`: A function to get the Svelte compiler.

#### Returns:

- A promise that resolves to an object containing:
  - `initialSrcdoc`: The computed `srcdoc` for the visualization.
  - `initialSrcdocError`: Any error that occurred during the computation.

### `createVizCache`

Creates a cache for visualizations, used to resolve imports from other visualizations.

#### Parameters:

- `initialContents`: An array of initial contents to populate the cache.
- `handleCacheMiss`: A function that is called when a visualization is not found in the cache.

#### Returns:

- A `VizCache` object with the following methods:
  - `get(vizId)`: Retrieves the content of a visualization by its ID.
  - `set(content)`: Adds or updates the content of a visualization in the cache.
  - `invalidate(vizId)`: Invalidates the cache for a specific visualization.

### `setJSDOM`

Sets the DOM parser for environments where the native DOMParser is not available (e.g., Node.js).

#### Parameters:

- `JSDOM`: The JSDOM instance to use for parsing HTML.

### `cleanRollupErrorMessage`

Cleans up Rollup error messages by removing unnecessary details like the viz ID.

#### Parameters:

- `rawMessage`: The raw error message from Rollup.
- `vizId`: The ID of the visualization.

#### Returns:

- A cleaned-up error message.

## Development

To contribute to the development of this package, follow these steps:

### Clone the repository

\`\`\`
git clone https://github.com/vizhub-core/vizhub3.git
cd vizhub3
\`\`\`

### Install dependencies

\`\`\`
npm install
\`\`\`

### Run tests

The package uses Vitest for testing. To run the tests, use the following command:

\`\`\`
npm run test
\`\`\`

### Build the package

To build the package, use the following command:

\`\`\`
npm run build
\`\`\`

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

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

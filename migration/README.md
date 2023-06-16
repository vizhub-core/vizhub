# migration

This package is responsible for migrating data from VizHub V2 to V3. This involves translation from the old data model to the new data model, which is fairly involved. The aim is to have an incremental migration algorithm that can be run any time or periodically to migrate discrete intervals of time (`fromTime`, `toTime`).

## Migration Phases

The migration process is broken into phases, each of which is responsible for migrating a particular aspect of the data model. The phases are as follows:

- Incremental migration of Vizzes based on time
- As needed to support migrated Vizzes, the following additional entities are migrated:
  - Users
  - Commits (revision history for the vizzes)
  - Upvotes
  - Analytics events (e.g. view count history for particular vizzes)

### Pre-Private Beta Phase

Before private beta, the V3 database will be unstable and subject to being completely wiped at any time. This is because the data model is still in flux, and we are still experimenting with different approaches. During this time, the VizHub V2 production database will be used as the source of truth for the data model. The VizHub V3 production database will be used as the destination for the data model. Experiments will be conducted to identify the ideal incremental migration approach.

### Private Beta Phase

During the private beta phase, we will be incrementally migrating Vizzes from V2 to V3. This will be done in batches, with each batch being a discrete time interval. The first batch will be the first 1000 Vizzes created on V2. The second batch will be the next 1000 Vizzes created on V2, and so on. The migration process will be run periodically to migrate new batches of Vizzes. The VizHub V2 production database will be used as the source of truth for the data model. The VizHub V3 production database will be used as the destination for the data model.

During this time, the VizHub V2 production site will be fully operational and will experience no interference from this process. The VizHub V3 production site will be fully operational, but will not have the full set of Vizzes migrated from V2. The VizHub V3 production site will be able to display Vizzes that have been migrated, but will not be able to display Vizzes that have not yet been migrated.

During the private beta phase, migrated vizzes will be considered "read-only". This means they will not be editable, but they can however be forked. The forks will only exist in VizHub V3, and will not be migrated back to VizHub V2. This is because the VizHub V3 data model is not compatible with the VizHub V2 data model. The VizHub V3 data model is designed to be more flexible and extensible, and is designed to support future features such as private vizzes, private forks, and private comments.

### Public Beta Phase

Before entering the public beta phase, all vizzes will be migrated from V2 to V3. This means that V3 will be "caught up" to V2 at the time of public beta launch. During this time, the most recent changes from V2 will be migrated daily. This will ensure that V3 is always up to date with V2, lagging behind by at most one day. The VizHub V2 production site will be fully operational and will experience no interference from this process. The VizHub V3 production site will be fully operational, and will be able to display all Vizzes from V2.

### Production Phase

Eventually, the VizHub V2 site will be moved to another domain, `v2-readonly.vizhub.com`. This will be a read-only version of the VizHub V2 site, and will be used for archival purposes. The VizHub V3 site will be the primary site, and will be the only site that is actively maintained. The VizHub V3 site will be fully operational, and will be able to display all Vizzes from V2. The VizHub V2 site will be read-only, and will not be able to display any new Vizzes created on V3.

At this time, the VizHub V3 site will be able to not only display all Vizzes migrated from V2, but will also be able to **edit** them (a capability not available in Public Beta). This completes the migration process. Thereafter, VizHub V3 will be the only site that is actively maintained.

## Migration Algorithm

### Vector Embeddings

Each viz has a vector embedding that is used to find similar vizzes. This vector embedding is computed from the viz's title, description, and files. The vector embedding is computed using one of the following options:

- **Universal Sentence Encoder** A pre-trained model from TensorFlow.js. The model is trained on a large corpus of text, and is able to produce a vector embedding for any arbitrary text. The vector embedding is a 512-dimensional vector. The vector embedding is stored in Redis, which gives us access to RediSeach, which is a full-text search and vector similarity search engine. The vector embedding is stored in the database along with the ID of its associated viz.
- **OpenAI** A pre-trained model from OpenAI. The model is trained on a large corpus of text, and is able to produce a vector embedding for any arbitrary text. The vector embedding is a 1536-dimensional vector. The vector embedding is stored in the database as a JSON string.

## Product Features Supported by Embeddings

- **Similar Vizzes** Given a viz, find other vizzes that are similar to it. This is done by computing the cosine similarity between the vector embeddings of the vizzes. The top 10 most similar vizzes are returned.
- **Related Vizzes** Given a viz, find other vizzes that are related to it. This is done by computing the cosine similarity between the vector embeddings of the vizzes. The top 10 most related vizzes are returned.
- **Search** Given a search query, find vizzes that match the query. This is done by computing the cosine similarity between the vector embeddings of the vizzes and the vector embedding of the search query. The top 10 most similar vizzes are returned.
- **Autocomplete** Given a search query, find vizzes that match the query. This is done by computing the cosine similarity between the vector embeddings of the vizzes and the vector embedding of the search query. The top 10 most similar vizzes are returned.
- **Trending Vizzes** Given a time interval, find vizzes that are trending during that time interval. This is done by computing the cosine similarity between the vector embeddings of the vizzes and the vector embedding of the time interval. The top 10 most similar vizzes are returned.
- **Popular Vizzes** Given a time interval, find vizzes that are popular during that time interval. This is done by computing the cosine similarity between the vector embeddings of the vizzes and the vector embedding of the time interval. The top 10 most similar vizzes are returned.
- **AI-Assisted Code Completions** Given a code snippet, find other code snippets that are similar to it. This is done by computing the cosine similarity between the vector embeddings of the code snippets and the vector embedding of the code snippet. The developer experience is similar to that of GitHub Copilot within VSCode, but with the added benefit of being able to search for code snippets across all vizzes on VizHub. AI-Assisted Code Completions use the same vector embeddings as the Search feature. AI-Assisted Code Completions integrate with CodeMirror to provide a seamless developer experience. The integration is based on the [CodeMirror LSP](https://codemirror.net/6/docs/ref/#lsp) feature. This is alongside completions provided by the language server, which is based on the [CodeMirror Language Server Protocol](https://codemirror.net/6/docs/ref/#languageServer). The AI-Assisted Code Completions are provided by the [CodeMirror Autocomplete](https://codemirror.net/docs/ref/#autocomplete) feature.

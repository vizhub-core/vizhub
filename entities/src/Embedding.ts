// Embedding
// * A vector for vector similarity search.
// * Computed from the source code of a Viz.
// * Always computed from the latest commit of a Viz.
// * Needs to be updated when latest commit changes.

import { VizId } from '@vizhub/viz-types';

export interface VizEmbedding {
  vizId: VizId;
  // The length is from OpenAI, so 1536
  embedding: Array<number>;
}

// In Supabase:

// Our table:
// create table vizEmbeddings (
//   vizId text primary key,
//   commitId text not null,
//   embedding vector(1536)
// )

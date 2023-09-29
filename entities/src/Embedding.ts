// // Embedding
// // * A vector for vector similarity search.
// export interface Embedding {
//   id: EmbeddingId;
//   type: EmbeddingType;
//   vector: Array<number>;
// }

import { VizId } from './Viz';

// export type EmbeddingId = string;

// // Embeddings can be computed for different types of objects.
// export type EmbeddingType = 'Viz' | 'File' | 'User';

export interface VizEmbedding {
  vizId: VizId;
  embedding: Array<number>;
}

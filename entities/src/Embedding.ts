// Embedding
// * A vector for vector similarity search.
export interface Embedding {
  id: EmbeddingId;
  type: EmbeddingType;
  vector: Array<number>;
}

export type EmbeddingId = string;

// Embeddings can be computed for different types of objects.
export type EmbeddingType = 'Viz' | 'File' | 'User';

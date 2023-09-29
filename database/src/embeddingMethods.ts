export const embeddingMethods = (supabase) => ({
  saveVizEmbedding: async (vizEmbedding) => {
    const { vizId, embedding } = vizEmbedding;
    const { data, error } = await supabase
      .from('viz_embeddings')
      .insert([
        {
          viz_id: vizId,
          embedding,
        },
      ]);
    if (error) {
      return {
        outcome: 'failure',
        error,
      };
    }
    return {
      outcome: 'success',
    };
  },
  getVizEmbedding: async (vizId) => {
    const { data, error } = await supabase
      .from('viz_embeddings')
      .select('embedding')
      .eq('viz_id', vizId)
      .single();
    if (error) {
      return {
        outcome: 'failure',
        error,
      };
    }
    return {
      outcome: 'success',
      value: {
        vizId,
        embedding: data.embedding,
      },
    };
  },
  knnVizEmbeddingSearch: async (
    embedding: Array<number>,
    k: number,
  ) => {
    const { data, error } = await supabase.rpc(
      'knn_viz_embedding_search',
      {
        embedding,
        match_count: k,
      },
    );
    if (error) {
      // TODO user err
      return {
        outcome: 'failure',
        error,
      };
    }
    // TODO use ok
    return {
      outcome: 'success',
      value: data,
    };
  },
});

//   // saveVizEmbedding
//   //
//   // Saves the embedding for the given viz.
//   // This is backed by Postgres and `pgvector` in Supabase.
//   // Also implemented in MemoryGateways for testing.
//   saveVizEmbedding(
//     vizEmbedding: VizEmbedding,
//   ): Promise<Result<Success>>;

//   // getVizEmbedding
//   //
//   // Gets the embedding for the given viz.
//   getVizEmbedding(id: VizId): Promise<Result<VizEmbedding>>;

//   // knnVizEmbeddingSearch
//   //
//   // Gets the nearest neighbors of the given embedding.
//   // This is backed by Postgres and `pgvector` in Supabase.
//   // Also implemented in MemoryGateways for testing.
//   knnVizEmbeddingSearch(
//     embedding: Array<number>,
//     k: number,
//   ): Promise<Result<Array<VizId>>>;

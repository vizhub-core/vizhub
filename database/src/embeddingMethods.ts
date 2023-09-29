import { VizEmbedding, VizId } from 'entities';
import { Result, ok } from 'gateways';
export const embeddingMethods = (supabase) => ({
  saveVizEmbedding: async (vizEmbedding: VizEmbedding) => {
    const { vizId, commitId, embedding } = vizEmbedding;
    const { data, error } = await supabase
      .from('viz_embeddings')
      .insert([
        {
          viz_id: vizId,
          commit_id: commitId,
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
  // getVizEmbedding(id: VizId): Promise<Result<VizEmbedding>>;
  getVizEmbedding: async (
    vizId: VizId,
  ): Promise<Result<VizEmbedding>> => {
    const { data, error } = await supabase
      .from('viz_embeddings')
      // .select('embedding')
      .select('embedding, commit_id') // Select multiple columns here

      // TODO also select commit_id

      .eq('viz_id', vizId)
      .single();
    if (error) {
      return {
        outcome: 'failure',
        error,
      };
    }
    const vizEmbedding: VizEmbedding = {
      vizId,
      commitId: data.commit_id,
      embedding: JSON.parse(data.embedding),
    };

    return ok(vizEmbedding);
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

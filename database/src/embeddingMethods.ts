import { VizEmbedding, VizId } from 'entities';
import {
  Result,
  err,
  ok,
  resourceNotFoundError,
} from 'gateways';
export const embeddingMethods = (supabase) => ({
  saveVizEmbedding: async (vizEmbedding: VizEmbedding) => {
    const { vizId, commitId, embedding } = vizEmbedding;
    const { error } = await supabase
      .from('viz_embeddings')
      .insert([
        {
          viz_id: vizId,
          commit_id: commitId,
          embedding,
        },
      ]);
    return error ? err(error) : ok('success');
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
      if (
        error.message ===
        'JSON object requested, multiple (or no) rows returned'
      ) {
        return err(
          resourceNotFoundError(vizId, 'VizEmbedding'),
        );
      }
      return err(error);
    }

    const vizEmbedding: VizEmbedding = {
      vizId,
      commitId: data.commit_id,
      embedding: JSON.parse(data.embedding),
    };

    return ok(vizEmbedding);
  },
  deleteVizEmbedding: async (vizId: VizId) => {
    const { error } = await supabase
      .from('viz_embeddings')
      .delete()
      .eq('viz_id', vizId);
    if (error) {
      if (
        error.message ===
        'JSON object requested, multiple (or no) rows returned'
      ) {
        return err(
          resourceNotFoundError(vizId, 'VizEmbedding'),
        );
      }
      return err(error);
    }
    return ok('success');
  },
  knnVizEmbeddingSearch: async (
    embedding: Array<number>,
    k: number,
  ) => {
    // The following is a Postgres function that uses `pgvector` to
    // perform a kNN search.
    /*
DROP FUNCTION IF EXISTS knn_viz_embedding_search(vector(1536), int);
create or replace function knn_viz_embedding_search(
    embedding vector(1536),
    match_count int
)
returns table (
    viz_id text,
    similarity float
)
language plpgsql
as $$
#variable_conflict use_variable
begin
  return query
  select
    viz_embeddings.viz_id,
    (viz_embeddings.embedding <#> embedding) * -1 as similarity
  from viz_embeddings
  order by viz_embeddings.embedding <#> embedding
  limit match_count;
end;
$$;

  */
    const { data, error } = await supabase.rpc(
      'knn_viz_embedding_search',
      {
        embedding,
        match_count: k,
      },
    );

    return error
      ? err(error)
      : ok(data.map((row) => row.viz_id));
  },
});

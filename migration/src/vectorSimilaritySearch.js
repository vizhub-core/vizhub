import { idx, tobytes } from './redisSetup';

export const vectorSimilaritySearch = async ({
  redisClient,
  embedding,
  timestamp,
}) => {
  // Perform a K-Nearest Neighbors vector similarity search
  // Documentation: https://redis.io/docs/stack/search/reference/vectors/#pure-knn-queries
  // We use the embedding for the current viz as our search vector.
  // This will find vizzes that are similar to this one,
  // but only ones that were created before this one (timestamp range query).
  const knnResults = await redisClient.sendCommand([
    'FT.SEARCH',
    idx,
    // timestamp - 1 here so we don't include this viz itself.
    `(@timestamp:[0,${timestamp - 1}])=>[KNN 4 @v $BLOB AS dist]`,
    'PARAMS',
    '2',
    'BLOB',
    tobytes(embedding),
    'SORTBY',
    'dist',
    'DIALECT',
    '2',
  ]);
  return knnResults[1];
};

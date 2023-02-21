import { logDetail } from './logDetail';
import { generateEmbedding } from './generateEmbedding';
import { storeEmbedding } from './storeEmbedding';
import { computeForkedFrom } from './computeForkedFrom';
import { isolateGoodFiles } from './isolateGoodFiles';

export const processViz = async ({
  vizV2,
  databaseGateways,
  i,
  redisClient,
  contentCollection,
}) => {
  const { info, content, ops } = vizV2;
  const { id, createdTimestamp } = info;

  // Sometimes titles have leading or trailing spaces.
  const title = info.title.trim();

  logDetail(`Processing viz #${i}: ${id} ${title} `);

  const goodFiles = isolateGoodFiles(content);
  if (!goodFiles) {
    console.log('  No good files, skipping.');
    return;
  }
  const embedding = await generateEmbedding(goodFiles);
  await storeEmbedding({
    redisClient,
    id,
    embedding,
    timestamp: createdTimestamp,
  });

  const isPrimordialViz = i === 0;

  const { forkedFrom, forkedFromIsBackfilled } = await computeForkedFrom({
    isPrimordialViz,
    vizV2,
    contentCollection,
    embedding,
    redisClient,
  });

  console.log({ forkedFrom, forkedFromIsBackfilled });
};

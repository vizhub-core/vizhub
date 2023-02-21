import { logDetail } from './logDetail';
import { generateEmbedding } from './generateEmbedding';
import { storeEmbedding } from './storeEmbedding';

// Check if files is even usable.
const filesAreValid = (contentV2) =>
  contentV2.files && contentV2.files.length > 0;

// Exclude bundle.js in our analysis.
// It contains noise like sourcemaps and transpiled JSX.
const getGoodFiles = (files) =>
  files.filter((file) => file.name !== 'bundle.js');

export const processViz = async ({
  vizV2,
  databaseGateways,
  i,
  redisClient,
}) => {
  const { info, content, ops } = vizV2;
  const { id, createdTimestamp } = info;

  // Sometimes titles have leading or trailing spaces.
  const title = info.title.trim();

  logDetail(`Processing viz #${i}: ${id} ${title} `);

  if (!filesAreValid(content)) {
    logDetail(`  No files, skipping...`);
    return;
  }

  const goodFiles = getGoodFiles(content.files);
  if (goodFiles.length === 0) {
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

  console.log('stored embedding');
};

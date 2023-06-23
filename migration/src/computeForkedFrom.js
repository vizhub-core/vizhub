import { logDetail } from './logDetail';
import { isVizV2Valid } from './isVizV2Valid';
import { vectorSimilaritySearch } from './vectorSimilaritySearch';

let guessesCorrect = 0;
let guessesIncorrect = 0;

// TODO backfill forked from deleted viz case
// by querying the ShareDB op log looking for the creation op,
// then setting forkedFrom to the parent.
export const computeForkedFrom = async ({
  isPrimordialViz,
  vizV2,
  contentCollection,
  embedding,
  redisClient,
}) => {
  // Compute forkedFrom
  let forkedFrom = null;
  let forkedFromIsBackfilled = false;
  if (!isPrimordialViz) {
    // Figure out if we need to backfill forkedFrom.
    logDetail('  Checking if we need to backfill forkedFrom...');

    let isForkedFromValid = false;
    if (!vizV2.info.forkedFrom) {
      logDetail('    Forked from is not defined. Need to backfill.');
    } else {
      isForkedFromValid = await isVizV2Valid({
        id: vizV2.info.forkedFrom,
        contentCollection,
      });
      if (isForkedFromValid) {
        logDetail('    Forked from is legit. No need to backfill.');

        // TODO Test how accurate this is
        const mostSimilar = await vectorSimilaritySearch({
          redisClient,
          embedding,
          timestamp: vizV2.info.createdTimestamp,
        });
        // logDetail(
        //   `      Guessed that ${vizV2.info.id} is forked from ${mostSimilar}`
        // );

        const guessIsCorrect = mostSimilar === vizV2.info.forkedFrom;
        logDetail(
          `      Guessed ${guessIsCorrect ? 'correctly' : 'incorrectly'} that ${
            vizV2.info.id
          } is forked from ${mostSimilar}`
        );
        if (guessIsCorrect) {
          guessesCorrect++;
        } else {
          guessesIncorrect++;
        }
      } else {
        logDetail('    Forked points to a deleted viz. Need to backfill.');
      }
    }

    if (isForkedFromValid) {
      forkedFrom = vizV2.info.forkedFrom;
      forkedFromIsBackfilled = vizV2.info.forkedFromBackfilled;
    } else {
      forkedFromIsBackfilled = true;
      logDetail('      Backfilling forkedFrom using vector similarity search!');

      const mostSimilar = await vectorSimilaritySearch({
        redisClient,
        embedding,
        timestamp: vizV2.info.createdTimestamp,
      });
      logDetail(
        `        Guessed that ${vizV2.info.id} is forked from ${mostSimilar}`
      );
      forkedFrom = mostSimilar;
      forkedFromIsBackfilled = true;
      //await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  }

  return { forkedFrom, forkedFromIsBackfilled };
};

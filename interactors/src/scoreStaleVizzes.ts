import { Gateways } from 'gateways';

const debug = true;

// Goal: keep vizzes up to date within 24 hours of their last update.
// Considering:
//  * Roughly 100,000 vizzes
//  * Roughly 1,000 viz page views per day
//  * We invoke ScoreStaleVizzes once per viz page view
//  * To score all vizzes daily, we need a batch size of
//    100,000 / 1,000 = 100
const batchSize = 100;

export const ScoreStaleVizzes = (gateways: Gateways) => {
  const { getStaleInfoIds } = gateways;

  return async (): Promise<void> => {
    const staleInfoIdsResult =
      await getStaleInfoIds(batchSize);
    if (staleInfoIdsResult.outcome === 'failure') {
      console.log('staleInfoIdsResult', staleInfoIdsResult);
      return;
    }
    const staleInfoIds = staleInfoIdsResult.value;

    if (debug) {
      console.log(
        '[ScoreStaleVizzes] staleInfoIds',
        staleInfoIds,
      );
    }
  };
};

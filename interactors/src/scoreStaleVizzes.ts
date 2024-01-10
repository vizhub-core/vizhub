import { Gateways } from 'gateways';
import { ScoreViz } from './scoreViz';
import { scoringLock } from 'entities/src/Lock';
import { Semaphore } from './Semaphore';

const debug = true;

// Goal: keep vizzes up to date within 24 hours of their last update.
// Considering:
//  * Roughly 100,000 vizzes
//  * Roughly 1,000 viz page views per day
//  * We invoke ScoreStaleVizzes once per viz page view
//  * To score all vizzes daily, we need a batch size of
//    100,000 / 1,000 = 100
const batchSize = 100;

// We set a lock duration of 60 seconds to allow the batch
// to take a long time and not crash the lock system.
const lockDuration = 60 * 1000;

// Within each node of the cluster,
// we only allow one batch to be in progress at a time.
// This avoides using Redlock as a queue system.
const scoringSemaphore = new Semaphore(1);

export const ScoreStaleVizzes = (gateways: Gateways) => {
  const { getStaleInfoIds, lock } = gateways;
  const scoreViz = ScoreViz(gateways);

  return async (): Promise<void> => {
    if (debug) {
      console.log('[ScoreStaleVizzes] awaiting lock...');
    }
    await scoringSemaphore.acquire();
    await lock(
      [scoringLock],
      async () => {
        if (debug) {
          console.log(
            '[ScoreStaleVizzes] got lock. Starting batch...',
          );
        }
        const start = Date.now();

        const staleInfoIdsResult =
          await getStaleInfoIds(batchSize);
        if (staleInfoIdsResult.outcome === 'failure') {
          console.log(
            'staleInfoIdsResult',
            staleInfoIdsResult,
          );
          return;
        }
        const staleInfoIds = staleInfoIdsResult.value;

        // if (debug) {
        //   console.log(
        //     '[ScoreStaleVizzes] staleInfoIds',
        //     staleInfoIds,
        //   );
        // }

        // for (const viz of staleInfoIds) {
        //   await scoreViz({ viz });
        // }

        // Parallel processing is faster than serial.
        await Promise.all(
          staleInfoIds.map((viz) => scoreViz({ viz })),
        );

        if (debug) {
          const end = Date.now();
          console.log(
            '[ScoreStaleVizzes] time elapsed for batch (seconds): ',
            (end - start) / 1000,
          );
        }
      },
      lockDuration,
    );
    scoringSemaphore.release();
  };
};

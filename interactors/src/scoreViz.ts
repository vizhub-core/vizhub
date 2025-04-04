import { Gateways, Result, ok, err } from 'gateways';
import {
  Info,
  infoLock,
  dateToTimestamp,
  getRuntimeVersion,
} from 'entities';
import { computePopularity } from './computePopularity';
import { VizId } from '@vizhub/viz-types';

// When true, backfills the runtimeVersion field.
// This is a one-time operation and will be disabled
// once all vizzes have been backfilled and CommitViz
// has been updated to automatically write the runtimeVersion
// field of the Info document.
const backfillRuntimeVersion = true;

// scoreViz
//  * Computes the popularity score for this viz
//  * Updates the viz Info with the new score
export const ScoreViz = (gateways: Gateways) => {
  const { getInfo, saveInfo, lock } = gateways;

  return async (options: {
    viz: VizId;
  }): Promise<Result<Info>> => {
    const { viz } = options;

    return lock([infoLock(viz)], async () => {
      // Get the viz Info
      const getInfoResult = await getInfo(viz);
      if (getInfoResult.outcome === 'failure') {
        return err(getInfoResult.error);
      }
      const info: Info = getInfoResult.value.data;

      // Compute the score
      const popularity = computePopularity(info);

      // Update the viz Info
      const newInfo: Info = {
        ...info,
        popularity,
        popularityUpdated: dateToTimestamp(new Date()),
      };

      // console.log(
      //   'backfillRuntimeVersion',
      //   backfillRuntimeVersion,
      // );
      if (backfillRuntimeVersion) {
        const getContentResult =
          await gateways.getContent(viz);
        if (getContentResult.outcome === 'failure') {
          return err(getContentResult.error);
        }
        const content = getContentResult.value.data;
        const runtimeVersion = getRuntimeVersion(content);
        // console.log('runtimeVersion', runtimeVersion);
        if (runtimeVersion === 3) {
          newInfo.v3 = true;
        }
      }

      const saveInfoResult = await saveInfo(newInfo);
      if (saveInfoResult.outcome === 'failure') {
        return err(saveInfoResult.error);
      }
      return ok(newInfo);
    });
  };
};

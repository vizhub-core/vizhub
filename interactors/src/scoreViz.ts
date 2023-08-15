import {
  Gateways,
  Result,
  ok,
  err,
  Success,
} from 'gateways';
import { VizId, Info } from 'entities';
import { computePopularity } from './computePopularity';

// scoreViz
//  * Computes the popularity score for this viz
//  * Updates the viz Info with the new score
export const ScoreViz = (gateways: Gateways) => {
  const { getInfo, saveInfo } = gateways;

  return async (options: {
    viz: VizId;
  }): Promise<Result<Success>> => {
    const { viz } = options;

    // TODO Redlock
    // Get the viz Info
    const getInfoResult = await getInfo(viz);
    if (getInfoResult.outcome === 'failure') {
      return err(getInfoResult.error);
    }
    const info: Info = getInfoResult.value.data;

    // Compute the score
    const popularity = computePopularity(info);

    // Update the viz Info
    const newInfo = {
      ...info,
      popularity,
    };
    const saveInfoResult = await saveInfo(newInfo);
    if (saveInfoResult.outcome === 'failure') {
      return err(saveInfoResult.error);
    }
    return ok('success');
  };
};

import { Gateways, Result, Success, ok, err } from 'gateways';
import { VizId, Info, Timestamp } from 'entities';

// trashViz
//  * Moves a viz to the "trash"
//  * TODO updates `forkedFrom` on all forks
//  * TODO DeleteViz should rewrite commit history
export const TrashViz = (gateways: Gateways) => {
  const { getInfo, saveInfo } = gateways;

  return async (options: {
    id: VizId; // The ID of the viz being trashed.
    timestamp: Timestamp; // The timestamp at which this viz is trashed.
  }): Promise<Result<Success>> => {
    const { id, timestamp } = options;
    // TODORedLock
    const getInfoResult = await getInfo(id);
    if (getInfoResult.outcome === 'failure') return err(getInfoResult.error);
    const info = getInfoResult.value.data;

    const newInfo: Info = {
      ...info,
      trashed: timestamp,
    };

    const saveResult = await saveInfo(newInfo);
    if (saveResult.outcome === 'failure') return err(saveResult.error);

    return ok('success');
  };
};

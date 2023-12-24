import {
  Gateways,
  Result,
  Success,
  ok,
  err,
} from 'gateways';
import {
  VizId,
  Info,
  Timestamp,
  infoLock,
  DELETE,
  UserId,
} from 'entities';
import {
  VerifyVizAccess,
  VizAccess,
} from './verifyVizAccess';
import { accessDeniedError } from 'gateways/src/errors';

// trashViz
//  * Moves a viz to the "trash"
export const TrashViz = (gateways: Gateways) => {
  const { getInfo, saveInfo, lock } = gateways;
  const verifyVizAccess = VerifyVizAccess(gateways);

  return async ({
    id,
    timestamp,
    authenticatedUserId,
  }: {
    id: VizId; // The ID of the viz being trashed.
    timestamp: Timestamp; // The timestamp at which this viz is trashed.
    authenticatedUserId?: UserId;
  }): Promise<Result<Success>> => {
    return lock([infoLock(id)], async () => {
      const getInfoResult = await getInfo(id);
      if (getInfoResult.outcome === 'failure')
        return err(getInfoResult.error);
      const info = getInfoResult.value.data;

      // Verify delete permission
      const verifyResult: Result<VizAccess> =
        await verifyVizAccess({
          authenticatedUserId,
          info,
          actions: [DELETE],
        });
      if (verifyResult.outcome === 'failure') {
        throw verifyResult.error;
      }
      const canDelete = verifyResult.value[DELETE];
      if (!canDelete) {
        return err(
          accessDeniedError(
            `User ${authenticatedUserId} cannot delete viz ${id}`,
          ),
        );
      }

      const newInfo: Info = {
        ...info,
        trashed: timestamp,
      };

      const saveResult = await saveInfo(newInfo);
      if (saveResult.outcome === 'failure')
        return err(saveResult.error);

      return ok('success');
    });
  };
};

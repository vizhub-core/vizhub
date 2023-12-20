import {
  Gateways,
  Result,
  ok,
  err,
  Success,
} from 'gateways';
import { diff } from 'ot';
import {
  VizId,
  Info,
  Content,
  Commit,
  CommitId,
  Timestamp,
  UserId,
  Visibility,
  Viz,
} from 'entities';
import { generateId } from './generateId';
import { SaveViz } from './saveViz';
import { GetContentAtCommit } from './getContentAtCommit';
import { CommitViz } from './commitViz';

// deleteViz
//  * Deletes a viz permanently
//  * Different from trash, which just marks a viz as "trashed"
//  * Deletes all commits, info, and content
//  * Updates forked from viz and forks for data integrity
export const DeleteViz = (gateways: Gateways) => {
  const { getInfo, deleteInfo } = gateways;

  return async ({
    id,
    deleteForks,
  }: {
    // The id of the viz to permanently delete.
    id: VizId;

    // Whether to delete all forks of the viz.
    // Should be `false` for when a user deletes a viz.
    // Should be `true` for when a corrupt viz is detected
    //   during migration and rolled back.
    deleteForks: boolean;
  }): Promise<Result<Success>> => {
    const infoResult = await getInfo(id);
    if (infoResult.outcome === 'failure')
      return err(infoResult.error);
    const info: Info = infoResult.value.data;

    // deleteInfo(id);
    const deleteResult = await deleteInfo(id);
    if (deleteResult.outcome === 'failure') {
      return err(deleteResult.error);
    }

    return ok('success');
  };
};

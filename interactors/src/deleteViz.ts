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
  const { getInfo, deleteInfo, deleteContent } = gateways;

  return async (id: VizId): Promise<Result<Success>> => {
    // Get the info so we can find out about forks and forkedFrom.
    const infoResult = await getInfo(id);
    if (infoResult.outcome === 'failure')
      return err(infoResult.error);
    const info: Info = infoResult.value.data;

    // TODO Decrement forksCount on forkedFrom viz
    // TODO

    // Delete the start commit
    // TODO define delete commit such that it
    // * finds all commits where that commit is the parent
    // * sets the parent of those commits to the parent of the deleted commit
    // * updates the ops of those commits to reflect the change

    // Delete the info
    const deleteInfoResult = await deleteInfo(id);
    if (deleteInfoResult.outcome === 'failure') {
      return err(deleteInfoResult.error);
    }

    // Delete the content
    const deleteContentResult = await deleteContent(id);
    if (deleteContentResult.outcome === 'failure') {
      return err(deleteContentResult.error);
    }

    return ok('success');
  };
};

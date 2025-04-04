import {
  Gateways,
  Result,
  ok,
  err,
  Success,
} from 'gateways';
import { Info } from 'entities';
import { VizId } from '@vizhub/viz-types';

// deleteViz
//  * Deletes a viz permanently
//  * Different from trash, which just marks a viz as "trashed"
//  * Deletes all commits, info, and content
//  * Updates forked from viz and forks for data integrity
export const DeleteViz = (gateways: Gateways) => {
  const {
    getInfo,
    deleteInfo,
    deleteContent,

    // TODO full commit deletion algorithm
    // * Find all commits where the deleted commit is the parent
    // * Set the parent of those commits to the parent of the deleted commit
    // * Update the ops of those commits to reflect the change
    deleteCommit,
  } = gateways;

  return async (id: VizId): Promise<Result<Success>> => {
    // Get the info so we can find out about forks and forkedFrom.
    const infoResult = await getInfo(id);
    if (infoResult.outcome === 'failure')
      return err(infoResult.error);
    const info: Info = infoResult.value.data;

    // TODO Decrement forksCount on forkedFrom viz

    // Delete the start commit
    const deleteStartCommitResult = await deleteCommit(
      info.start,
    );
    if (deleteStartCommitResult.outcome === 'failure') {
      return err(deleteStartCommitResult.error);
    }

    // If the start and end commits are different,
    // delete the end commit
    if (info.start !== info.end) {
      const deleteEndCommitResult = await deleteCommit(
        info.end,
      );
      if (deleteEndCommitResult.outcome === 'failure') {
        return err(deleteEndCommitResult.error);
      }
    }

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

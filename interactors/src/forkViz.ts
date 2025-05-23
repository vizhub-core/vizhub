import {
  Gateways,
  Result,
  ok,
  err,
  VizHubErrorCode,
} from 'gateways';
import { diff } from 'ot';
import {
  Info,
  Commit,
  CommitId,
  Timestamp,
  UserId,
  Visibility,
} from 'entities';
import { generateId } from './generateId';
import { SaveViz } from './saveViz';
import { GetContentAtCommit } from './getContentAtCommit';
import { CommitViz } from './commitViz';
import { VizContent, VizId } from '@vizhub/viz-types';

const debug = false;

// forkViz
//  * Forks a viz (makes a copy of it)
//  * Returns the id of the newly minted viz
//  * Fills in the commit data structure around the fork
//  * Most common case:
//    * Fork from the latest commit of a committed viz
//  * Less common cases:
//    * Fork from any commit, if forkedFromCommitId is provided.
//    * If uncommitted, the viz is committed first then forked.
//  * See also
//    https://gitlab.com/curran/vizhub-ee/-/blob/main/vizhub-ee-interactors/src/ForkVizEE.ts
export const ForkViz = (gateways: Gateways) => {
  const {
    saveCommit,
    getInfo,
    incrementForksCount,
    deleteCommit,
    deleteInfo,
  } = gateways;
  const saveViz = SaveViz(gateways);
  const getContentAtCommit = GetContentAtCommit(gateways);
  const commitViz = CommitViz(gateways);

  return async (options: {
    forkedFrom: VizId; // The ID of the viz being forked.
    timestamp: Timestamp; // The timestamp at which this viz is forked.
    newOwner: UserId; // The owner of the new viz.
    content?: VizContent; // The content of the new viz (optional).
    title?: string; // The title of the new viz (optional, defaults to old title).
    visibility?: Visibility; // The visibility of the new viz.
    forkedFromCommitId?: CommitId; // The ID of the commit being forked from (optional).
    newVizId?: VizId; // The ID of the new viz (optional).
  }): Promise<Result<Info>> => {
    // TODO access control - check if the authenticated user
    // is allowed to read the forkedFrom viz.
    const {
      forkedFrom,
      timestamp,
      newOwner,
      content,
      title,
      visibility,
      forkedFromCommitId,
    } = options;
    const commitId: CommitId = generateId();
    const newVizId: VizId =
      options.newVizId || generateId();

    // Get the info for the viz we are forking from.
    const infoResult = await getInfo(forkedFrom);
    if (infoResult.outcome === 'failure') {
      return err(infoResult.error);
    }
    const info: Info = infoResult.value.data;

    // Choose a particular commit to fork from.
    // If forkedFromCommitId is not specified,
    // fork from the endCommit of the forked from viz.
    // TODO if timestamp is less than last updated,
    // then fork from the last updated commit.

    let parentCommitId: CommitId =
      forkedFromCommitId || info.end;

    // If we want to fork from the current version
    // AND
    // we the viz currently has uncommitted changes,
    if (!forkedFromCommitId && !info.committed) {
      // then commit now, and fork from the resulting commit,
      // NOT from info.end which is outdated.
      const parentCommitIdResult =
        await commitViz(forkedFrom);
      if (parentCommitIdResult.outcome === 'failure')
        return err(parentCommitIdResult.error);
      parentCommitId = parentCommitIdResult.value.end;
    }

    const newInfo: Info = {
      ...info,
      id: newVizId,
      forkedFrom: forkedFrom,
      forksCount: 0,
      upvotesCount: 0,
      owner: newOwner,
      created: timestamp,
      updated: timestamp,
      start: commitId,
      end: commitId,
      committed: true,
    };

    // If we're forking in v3, this viz was not migrated from v2.
    if (newInfo.migratedFromV2) {
      delete newInfo.migratedFromV2;
    }

    // Don't carry over migratedTimestamp
    if (newInfo.migratedTimestamp) {
      delete newInfo.migratedTimestamp;
    }

    // If there was a slug, remove it.
    if (newInfo.slug) {
      delete newInfo.slug;
    }

    // If `anyoneCanEdit` was true, remove it in the fork.
    if (newInfo.anyoneCanEdit) {
      delete newInfo.anyoneCanEdit;
    }

    // If `popularity` was defined, remove it and `popularityUpdated`.
    if (newInfo.popularity) {
      delete newInfo.popularity;
      delete newInfo.popularityUpdated;
    }

    // If the title is specified, use it.
    if (title !== undefined) {
      newInfo.title = title;
    }

    // If the visibility is specified, use it.
    if (visibility !== undefined) {
      newInfo.visibility = visibility;
    }

    const oldContentResult =
      await getContentAtCommit(parentCommitId);
    if (oldContentResult.outcome === 'failure') {
      return oldContentResult;
    }
    const oldContent = oldContentResult.value;

    const newContent: VizContent = {
      ...oldContent,
      ...content,
      id: newVizId,
    };

    // Remove the README, since literally no one updates it anyway,
    // and the old README in modified vizzes is often outdated
    // and just doesn't make sense, especially the ones with the videos.
    newContent.files = Object.keys(newContent.files).reduce(
      (acc, fileId) => {
        if (newContent.files[fileId].name === 'README.md') {
          acc[fileId] = {
            name: 'README.md',
            text: '',
          };
        } else {
          acc[fileId] = newContent.files[fileId];
        }
        return acc;
      },
      {},
    );

    const newCommit: Commit = {
      id: commitId,
      parent: parentCommitId,
      viz: newVizId,
      authors: [newOwner],
      timestamp,
      ops: diff(oldContent, newContent),
      milestone: null,
    };

    // If something goes wrong with saving the commit,
    // then don't save the Info or Content.
    // This is why these are serial and not parallel.
    const saveCommitResult = await saveCommit(newCommit);
    if (saveCommitResult.outcome !== 'success') {
      return saveCommitResult;
    }
    const saveVizResult = await saveViz({
      info: newInfo,
      content: newContent,
    });
    if (saveVizResult.outcome !== 'success') {
      if (debug) {
        console.log(
          'saveVizResult.error.code',
          saveVizResult.error.code,
        );
      }
      // If the save failed due to a size limit check,
      // we need to delete the commit and the info.
      if (
        saveVizResult.error.code ===
          VizHubErrorCode.tooLarge ||
        saveVizResult.error.code ===
          VizHubErrorCode.tooLargeForFree
      ) {
        if (debug) {
          console.log(
            'Failed due to size limit, deleting Commit and Info...',
          );
        }
        const deleteCommitResult =
          await deleteCommit(commitId);
        if (deleteCommitResult.outcome !== 'success') {
          console.error(
            'Failed to delete commit',
            deleteCommitResult,
          );
          // return deleteCommitResult;
        }
        const deleteInfoResult = await deleteInfo(newVizId);
        if (deleteInfoResult.outcome !== 'success') {
          console.error(
            'Failed to delete info',
            deleteInfoResult,
          );
          // return deleteInfoResult;
        }
      }

      return saveVizResult;
    }

    // Increment forksCount
    const incrementResult =
      await incrementForksCount(forkedFrom);
    if (incrementResult.outcome !== 'success') {
      return incrementResult;
    }

    return ok(newInfo);
  };
};

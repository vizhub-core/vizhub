import { Gateways, Result, ok } from 'gateways';
import { diff } from 'ot';
import { VizId, Info, Commit, CommitId } from 'entities';
import { generateId } from './generateId';
import { GetViz } from './getViz';
import { GetContentAtCommit } from './getContentAtCommit';

const debug = false;
// commitViz
// * Mints a new commit for uncommitted changes.
// * See also
//   https://gitlab.com/curran/vizhub-ee/-/blob/main/vizhub-ee-interactors/src/CommitViz.ts
export const CommitViz = (gateways: Gateways) => {
  const { saveInfo, saveCommit } = gateways;
  const getViz = GetViz(gateways);
  const getContentAtCommit = GetContentAtCommit(gateways);

  return async (id: VizId): Promise<Result<CommitId>> => {
    // TODORedLock
    const getVizResult = await getViz(id);
    if (getVizResult.outcome === 'failure')
      return getVizResult;
    const { info, content } = getVizResult.value;
    const { end } = info;

    // commitViz only makes sense to call if viz.committed is false.
    // If the viz is already committed, then nothing is left to be done.
    if (info.committed) return ok('success');

    // Reconstruct the viz content as it was before the current
    // uncommitted changes were made. The new commit ops will diff
    // from this version to the current uncommitted version.
    const previousContentResult =
      await getContentAtCommit(end);
    if (previousContentResult.outcome === 'failure')
      return previousContentResult;
    const previousContent = previousContentResult.value;

    const newCommitId = generateId();

    const newCommit: Commit = {
      id: newCommitId,
      parent: end,
      viz: id,
      authors: info.commitAuthors,
      timestamp: info.updated,
      ops: diff(previousContent, content),
      milestone: null,
    };
    if (debug) {
      console.log('in commitViz');
      console.log('previousContent', previousContent);
      console.log('content', content);
      console.log(
        'newCommit',
        JSON.stringify(newCommit, null, 2),
      );
    }

    const newInfo: Info = {
      ...info,
      end: newCommitId,
      committed: true,
      commitAuthors: [],
    };

    // If something goes wrong with saving the commit,
    // then don't save the Info.
    // This is why these are serial and not parallel.
    const saveCommitResult = await saveCommit(newCommit);
    if (saveCommitResult.outcome !== 'success')
      return saveCommitResult;

    const saveInfoResult = await saveInfo(newInfo);
    if (saveInfoResult.outcome !== 'success')
      return saveInfoResult;

    return ok(newCommitId);
  };
};

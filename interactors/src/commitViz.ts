import { Gateways, Result, ok } from 'gateways';
import { diff } from 'ot';
import { Info, Commit, infoLock } from 'entities';
import { generateId } from './generateId';
import { GetViz } from './getViz';
import { GetContentAtCommit } from './getContentAtCommit';
import { VizId } from '@vizhub/viz-types';
import { determineRuntimeVersion } from '@vizhub/runtime';
import { vizFilesToFileCollection } from '@vizhub/viz-utils';

// const lock = async (lockIds: Array<ResourceLockId>, fn) => {
//   await redlock.using(lockIds, 5000, fn);
// };

const debug = false;
// commitViz
// * Mints a new commit for uncommitted changes.
// * See also
//   https://gitlab.com/curran/vizhub-ee/-/blob/main/vizhub-ee-interactors/src/CommitViz.ts
export const CommitViz = (gateways: Gateways) => {
  const { saveInfo, saveCommit, lock } = gateways;
  const getViz = GetViz(gateways);
  const getContentAtCommit = GetContentAtCommit(gateways);

  return async (id: VizId): Promise<Result<Info>> =>
    await lock([infoLock(id)], async () => {
      const getVizResult = await getViz(id);
      if (getVizResult.outcome === 'failure')
        return getVizResult;
      const { info, content } = getVizResult.value;
      const { end } = info;

      // commitViz only makes sense to call if viz.committed is false.
      // If the viz is already committed, then nothing is left to be done.
      if (info.committed) {
        return ok(info);
      }

      // Reconstruct the viz content as it was before the current
      // uncommitted changes were made. The new commit ops will diff
      // from this version to the current uncommitted version.
      const previousContentResult =
        await getContentAtCommit(end);
      if (previousContentResult.outcome === 'failure')
        return previousContentResult;
      const previousContent = previousContentResult.value;

      const newCommitId = generateId();

      const ops = diff(previousContent, content);

      const newCommit: Commit = {
        id: newCommitId,
        parent: end,
        viz: id,
        authors: info.commitAuthors,
        timestamp: info.updated,
        ops,
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

      // Mark V3 vizzes as such.
      const runtimeVersion = determineRuntimeVersion(
        vizFilesToFileCollection(content?.files),
      );
      if (runtimeVersion === 'v3') {
        newInfo.v3 = true;
      } else {
        delete newInfo.v3;
      }

      // If something goes wrong with saving the commit,
      // then don't save the Info.
      // This is why these are serial and not parallel.
      const saveCommitResult = await saveCommit(newCommit);
      if (saveCommitResult.outcome !== 'success')
        return saveCommitResult;

      const saveInfoResult = await saveInfo(newInfo);
      if (saveInfoResult.outcome !== 'success')
        return saveInfoResult;

      return ok(newInfo);
    });
};

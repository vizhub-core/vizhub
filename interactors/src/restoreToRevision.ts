import {
  err,
  Gateways,
  missingParameterError,
  Result,
  Success,
} from 'gateways';
import { CommitId, UserId, WRITE } from 'entities';
import { SaveViz } from './saveViz';
import { GetContentAtCommit } from './getContentAtCommit';
import { GetViz } from './getViz';
import {
  VerifyVizAccess,
  VizAccess,
} from './verifyVizAccess';
import { accessDeniedError } from 'gateways/src/errors';
import { VizId } from '@vizhub/viz-types';

const DEBUG = false;

export const RestoreToRevision = (gateways: Gateways) => {
  const getViz = GetViz(gateways);
  const saveViz = SaveViz(gateways);
  const verifyVizAccess = VerifyVizAccess(gateways);
  const getContentAtCommit = GetContentAtCommit(gateways);

  return async ({
    vizId,
    commitId,
    authenticatedUserId,
  }: {
    vizId: VizId;
    commitId: CommitId;
    authenticatedUserId: UserId;
  }): Promise<Result<Success>> => {
    DEBUG &&
      console.log('[restoreToRevision] ', {
        vizId,
        commitId,
      });

    // Validate that the vizId is provided.
    if (vizId === undefined) {
      return err(missingParameterError('vizId'));
    }

    // Validate that the commitId is provided.
    if (commitId === undefined) {
      return err(missingParameterError('commitId'));
    }

    DEBUG && console.log('[restoreToRevision] getViz');
    const getVizResult = await getViz(vizId);
    if (getVizResult.outcome === 'failure') {
      return getVizResult;
    }
    const viz = getVizResult.value;

    DEBUG &&
      console.log(
        '[restoreToRevision] verifyVizAccess ',
        JSON.stringify({
          authenticatedUserId,
          info: viz.info,
        }),
      );
    // Validate that the authenticated user
    // is allowed to write to this viz.
    const vizAccessResult: Result<VizAccess> =
      await verifyVizAccess({
        authenticatedUserId,
        info: viz.info,
        actions: [WRITE],
      });
    if (vizAccessResult.outcome === 'failure') {
      return err(vizAccessResult.error);
    }
    if (!vizAccessResult.value.write) {
      return err(accessDeniedError('Write access denied'));
    }

    DEBUG &&
      console.log('[restoreToRevision] getContentAtCommit');
    const contentResult =
      await getContentAtCommit(commitId);
    if (contentResult.outcome === 'failure') {
      return contentResult;
    }
    const content = contentResult.value;

    DEBUG && console.log('[restoreToRevision] saveViz');
    return await saveViz({
      info: { ...viz.info, end: commitId },
      content,
    });
  };
};

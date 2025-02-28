import { Gateways, Result, err, ok } from 'gateways';
import {
  VizId,
  UserId,
  RevisionHistory,
  CommitMetadata,
  CommitId,
} from 'entities';
import {
  VerifyVizAccess,
  VizAccess,
} from './verifyVizAccess';
import {
  accessDeniedError,
  missingParameterError,
} from 'gateways/src/errors';
import { GetThumbnailURLs } from './getThumbnailURLs';

// getRevisionHistory
// * Gets the revision history of a viz
// * Including commit metadata and thumbnail URLs
export const GetRevisionHistory = (gateways: Gateways) => {
  const { getRevisionHistoryCommitMetadata, getInfo } =
    gateways;
  const verifyVizAccess = VerifyVizAccess(gateways);
  const getThumbnailURLs = GetThumbnailURLs(gateways);

  return async ({
    vizId,
    authenticatedUserId,
  }: {
    vizId: VizId;
    authenticatedUserId: UserId;
  }): Promise<Result<RevisionHistory>> => {
    if (vizId === undefined) {
      return err(missingParameterError('vizId'));
    }

    // Verify access
    const infoResult = await getInfo(vizId);
    if (infoResult.outcome === 'failure') {
      return err(infoResult.error);
    }
    const vizAccessResult: Result<VizAccess> =
      await verifyVizAccess({
        authenticatedUserId,
        info: infoResult.value.data,
        actions: ['read'],
      });
    if (vizAccessResult.outcome === 'failure') {
      return err(vizAccessResult.error);
    }
    if (!vizAccessResult.value.read) {
      return err(accessDeniedError('Read access denied'));
    }

    // Get commit metadata
    const getRevisionHistoryCommitMetadataResult =
      await getRevisionHistoryCommitMetadata(vizId);
    if (
      getRevisionHistoryCommitMetadataResult.outcome ===
      'failure'
    ) {
      return err(
        getRevisionHistoryCommitMetadataResult.error,
      );
    }
    const commitMetadataList: Array<CommitMetadata> =
      getRevisionHistoryCommitMetadataResult.value;

    // Get thumbnail URLs
    const thumbnailURLs: Record<CommitId, string> =
      await getThumbnailURLs(
        commitMetadataList.map(
          (commitMetadata) => commitMetadata.id,
        ),
      );

    const revisionHistory: RevisionHistory = {
      commitMetadataList,
      thumbnailURLs,
    };

    return ok(revisionHistory);
  };
};

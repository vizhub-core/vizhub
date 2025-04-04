import { Gateways, Result } from 'gateways';
import { Timestamp } from 'entities';
import { GetContentAtCommit } from './getContentAtCommit';
import { GetCommitAtTimestamp } from './getCommitAtTimestamp';
import { VizContent, VizId } from '@vizhub/viz-types';

// https://gitlab.com/curran/vizhub-ee/-/blob/main/vizhub-ee-interactors/src/GetContentAtTimestamp.ts
export const GetContentAtTimestamp = (
  gateways: Gateways,
) => {
  const { getInfo } = gateways;
  const getCommitAtTimestamp =
    GetCommitAtTimestamp(gateways);
  const getContentAtCommit = GetContentAtCommit(gateways);

  return async (
    id: VizId,
    timestamp: Timestamp,
  ): Promise<Result<VizContent>> => {
    const infoResult = await getInfo(id);
    if (infoResult.outcome === 'failure') return infoResult;
    const info = infoResult.value.data;

    const commitIdResult = await getCommitAtTimestamp(
      info,
      timestamp,
    );
    if (commitIdResult.outcome === 'failure')
      return commitIdResult;
    const commitId = commitIdResult.value;

    return await getContentAtCommit(commitId);
  };
};

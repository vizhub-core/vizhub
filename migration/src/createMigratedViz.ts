import { CommitId, Info, VizId } from 'entities';
import { Gateways, Result, ok } from 'gateways';
import { ForkViz } from 'interactors';
import { VizV2 } from './VizV2';
import { GetCommitAtTimestamp } from 'interactors';

export const createMigratedViz = async ({
  vizV2,
  forkedFrom,
  gateways,
}: {
  vizV2: VizV2;
  forkedFrom: VizId;
  gateways: Gateways;
}): Promise<Result<Info>> => {
  const { getInfo } = gateways;
  const forkViz = ForkViz(gateways);
  const getCommitAtTimestamp = GetCommitAtTimestamp(gateways);

  // Get the commit id of the forkedFrom viz at the creation timestamp of the vizV2.
  const infoResult = await getInfo(forkedFrom);
  if (infoResult.outcome === 'failure') return infoResult;
  const info = infoResult.value.data;
  const timestamp = vizV2.info.createdTimestamp;
  const commitIdResult = await getCommitAtTimestamp(info, timestamp);
  if (commitIdResult.outcome === 'failure') return commitIdResult;
  const forkedFromCommitId: CommitId = commitIdResult.value;

  // If we are here, then the viz has never been migrated
  // so we need to create a new viz in V3 by forking the viz in V3.
  // Fork the forkedFrom vis at the specific timestamp
  // when the vizV2 was created.
  const forkResult = await forkViz({
    newOwner: vizV2.info.owner,
    forkedFrom,
    timestamp: vizV2.info.createdTimestamp,
    newVizId: vizV2.info.id,
    forkedFromCommitId,
  });

  if (forkResult.outcome === 'failure') {
    console.log('Error while forking.');
    console.log(forkResult.error);
    process.exit();
  }
  const migratedInfo: Info = forkResult.value;

  // This function only does the forking.
  // The content is filled in later by updateMigratedViz.
  return ok(migratedInfo);
};

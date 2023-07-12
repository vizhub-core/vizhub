import { CommitId, Info, VizId } from 'entities';
import { Gateways, Result, ok } from 'gateways';
import { ForkViz } from 'interactors';
import { VizV2 } from './VizV2';
import { GetCommitAtTimestamp } from 'interactors';

const debug = false;

// If we're here, then the viz has not yet been migrated.
// The task before us is to create a new viz in V3 by forking the viz in V3.
// The new viz will have the same id as the viz in V2.
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

  // Figure out the commitId of the forkedFrom viz at the time the vizV2 was created.
  const forkedFromInfoResult = await getInfo(forkedFrom);
  if (forkedFromInfoResult.outcome === 'failure') return forkedFromInfoResult;
  const forkedFromInfo = forkedFromInfoResult.value.data;
  const commitIdResult = await getCommitAtTimestamp(
    forkedFromInfo,
    vizV2.info.createdTimestamp,
  );
  if (commitIdResult.outcome === 'failure') return commitIdResult;
  const forkedFromCommitId: CommitId = commitIdResult.value;

  if (debug) {
    console.log('     in createMigratedViz');
    console.log('     forkedFromCommitId:', forkedFromCommitId);
    console.log({
      newOwner: vizV2.info.owner,
      forkedFrom,
      timestamp: vizV2.info.createdTimestamp,
      newVizId: vizV2.info.id,
      forkedFromCommitId,
    });
  }
  // If we are here, then the viz has never been migrated
  // so we need to create a new viz in V3 by forking the viz in V3.
  // Fork the forkedFrom vis at the specific timestamp
  // when the vizV2 was created.
  const forkResult = await forkViz({
    newOwner: vizV2.info.owner,
    forkedFrom,
    timestamp: vizV2.info.createdTimestamp,
    newVizId: vizV2.info.id,
    // forkedFromCommitId,
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

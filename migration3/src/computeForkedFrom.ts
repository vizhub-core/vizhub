import { CommitId, Info, Timestamp, VizId } from 'entities';
import { Gateways } from 'gateways';

// Hardcoded ID of the primordial viz (actually in the V2 database)
const primordialVizId = '86a75dc8bdbe4965ba353a79d4bd44c8';

export const computeForkedFrom = async ({
  forkedFromV2,
  createdTimestamp,
  gateways,
}: {
  forkedFromV2: VizId;
  createdTimestamp: Timestamp;
  gateways: Gateways;
}): Promise<{
  forkedFrom: VizId | null;
  forkedFromCommitId: CommitId | null;
}> => {
  const { getInfo } = gateways;

  // Should never happen, as we don't call this function
  // for the primordial viz.
  if (forkedFromV2 === null) {
    throw new Error('forkedFromV2 is null');
  }

  // Assume the forked from viz exists.
  let forkedFrom: VizId = forkedFromV2;
  let forkedFromInfo: Info;

  // Validate that the `forkedFrom` viz exists.
  // If not, then fork from the primordial viz.
  //   gateways.getInfo(forkedFromV2);
  const forkedFromInfoResult = await getInfo(forkedFromV2);
  if (forkedFromInfoResult.outcome === 'failure') {
    console.log(
      `    Forked from viz ${forkedFromV2} does not exist. Forking from primordial viz.`,
    );
    forkedFrom = primordialVizId;
    const primordialVizInfoResult =
      await getInfo(primordialVizId);

    // Should never happen.
    if (primordialVizInfoResult.outcome === 'failure') {
      throw new Error('Primordial viz does not exist.');
    }

    forkedFromInfo = primordialVizInfoResult.value.data;
  } else {
    forkedFromInfo = forkedFromInfoResult.value.data;
  }

  // Now we need to figure out which commit to fork from.
  // It's either `forkedFromInfo.end` or `forkedFromInfo.start`.
  // Invariants:
  //  * `startCommit.timestamp === info.created`
  //  * `endCommit.timestamp === info.updated`
  // If createdTimestamp > forkedFromInfo.updated,
  // then fork from the end commit.
  // Otherwise, fork from the start commit.
  const forkedFromCommitId =
    createdTimestamp > forkedFromInfo.updated
      ? forkedFromInfo.end
      : forkedFromInfo.start;

  // If this is not the primordial viz, then fork from the
  // forkedFrom viz, and from the last commit of the forkedFrom viz.
  return {
    forkedFrom,
    forkedFromCommitId,
  };
};

import xss from 'xss';
import {
  Info,
  Snapshot,
  User,
  UserId,
  VizId,
} from 'entities';
import { Gateways, Result } from 'gateways';
import { Auth0User } from '../Page';
import { getAuthenticatedUser } from '../getAuthenticatedUser';
import {
  StargazersPage,
  StargazersPageData,
} from './index';

StargazersPage.getPageData = async ({
  gateways,
  params,
  auth0User,
}: {
  gateways: Gateways;
  auth0User: Auth0User | null;
  params: { id: string };
}): Promise<StargazersPageData> => {
  const starredVizId: VizId = params.id;
  const { getUsersByIds, getInfo, getUpvotes } = gateways;

  const getUpvotesResult = await getUpvotes(null, [
    starredVizId,
  ]);
  if (getUpvotesResult.outcome === 'failure') {
    console.log('Error when fetching upvotes:');
    console.log(getUpvotesResult.error);
    return null;
  }

  const upvotes = getUpvotesResult.value;

  const userIds: Array<UserId> = upvotes.map(
    (upvote) => upvote.data.user,
  );
  const userSnapshotsResult: Result<Array<Snapshot<User>>> =
    await getUsersByIds(userIds);
  if (userSnapshotsResult.outcome === 'failure') {
    console.log('Error when fetching user snapshots:');
    console.log(userSnapshotsResult.error);
    return null;
  }
  // userProfileHref={getProfilePageHref(user)}
  // userAvatarURL={getAvatarURL(user)}
  // userDisplayName={getUserDisplayName(user)}

  const { authenticatedUserSnapshot } =
    await getAuthenticatedUser({
      gateways,
      auth0User,
    });

  // Get the Info snapshot for the forked-from viz
  const forkedFromInfoResult = await getInfo(forkedFrom);
  if (forkedFromInfoResult.outcome === 'failure') {
    console.log('Error when fetching forked-from info:');
    console.log(forkedFromInfoResult.error);
    return null;
  }
  const forkedFromInfoSnapshot = forkedFromInfoResult.value;
  const forkedFromInfo: Info = forkedFromInfoSnapshot.data;

  // Get the owner of the forked-from viz
  const forkedFromOwnerResult = await getUser(
    forkedFromInfo.owner,
  );
  if (forkedFromOwnerResult.outcome === 'failure') {
    console.log('Error when fetching forked-from owner:');
    console.log(forkedFromOwnerResult.error);
    return null;
  }
  const forkedFromOwnerUserSnapshot =
    forkedFromOwnerResult.value;

  return {
    title: `Forks of ${xss(forkedFromInfo.title)}`,
    authenticatedUserSnapshot,
  };
};

export { StargazersPage };

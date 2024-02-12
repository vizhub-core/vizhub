import xss from 'xss';
import {
  Info,
  Snapshot,
  Timestamp,
  Upvote,
  User,
  UserId,
  getUserDisplayName,
} from 'entities';
import { Gateways, Result } from 'gateways';
import { Auth0User } from '../Page';
import { getAuthenticatedUser } from '../getAuthenticatedUser';
import {
  StargazersPage,
  StargazersPageData,
} from './index';
import { GetInfoByIdOrSlug } from 'interactors';
import { getProfilePageHref } from '../../accessors';
import { getAvatarURL } from '../../accessors/getAvatarURL';

StargazersPage.getPageData = async ({
  gateways,
  params: { userName, idOrSlug },
  auth0User,
}): Promise<StargazersPageData> => {
  const getInfoByIdOrSlug = GetInfoByIdOrSlug(gateways);
  const { getUsersByIds, getUpvotes, getUserByUserName } =
    gateways;

  // Get the User entity for the owner of the viz.
  const ownerUserResult = await getUserByUserName(userName);
  if (ownerUserResult.outcome === 'failure') {
    console.log('Error when fetching owner user:');
    console.log(ownerUserResult.error);
    return null;
  }
  const ownerUserSnapshot = ownerUserResult.value;
  const starredVizOwnerUser: User = ownerUserSnapshot.data;

  // Get the Info entity of the Viz.
  const infoResult = await getInfoByIdOrSlug({
    userId: starredVizOwnerUser.id,
    idOrSlug,
  });
  if (infoResult.outcome === 'failure') {
    return null;
  }
  const infoSnapshot: Snapshot<Info> = infoResult.value;
  const starredVizInfo: Info = infoSnapshot.data;

  // Get the upvotes for the viz.
  const getUpvotesResult = await getUpvotes(null, [
    starredVizInfo.id,
  ]);
  if (getUpvotesResult.outcome === 'failure') {
    console.log('Error when fetching upvotes:');
    console.log(getUpvotesResult.error);
    return null;
  }
  const upvotes: Array<Upvote> = getUpvotesResult.value.map(
    (snapshot) => snapshot.data,
  );

  // Get all the users who upvoted the viz.
  const userIds: Array<UserId> = upvotes.map(
    (upvote) => upvote.user,
  );
  const userSnapshotsResult: Result<Array<Snapshot<User>>> =
    await getUsersByIds(userIds);
  if (userSnapshotsResult.outcome === 'failure') {
    console.log('Error when fetching user snapshots:');
    console.log(userSnapshotsResult.error);
    return null;
  }
  const usersMap: Record<UserId, User> =
    userSnapshotsResult.value.reduce((acc, snapshot) => {
      acc[snapshot.data.id] = snapshot.data;
      return acc;
    }, {});

  // Compute the stargazers.
  const stargazers: Array<{
    userProfileHref: string;
    userAvatarURL: string;
    userDisplayName: string;
    upvotedTimestamp: Timestamp;
  }> = upvotes.map((upvote) => {
    const user = usersMap[upvote.user];
    return {
      userProfileHref: getProfilePageHref(user),
      userAvatarURL: getAvatarURL(user),
      userDisplayName: getUserDisplayName(user),
      upvotedTimestamp: upvote.timestamp,
    };
  });

  // Get the authenticated user.
  const { authenticatedUserSnapshot } =
    await getAuthenticatedUser({
      gateways,
      auth0User,
    });

  const pageDate: StargazersPageData = {
    title: `Stargazers of ${xss(starredVizInfo.title)}`,
    authenticatedUserSnapshot,
    starredVizInfo,
    starredVizOwnerUser,
    stargazers,
  };
  return pageDate;
};

export { StargazersPage };

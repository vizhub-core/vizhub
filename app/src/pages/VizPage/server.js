import { VizPage } from './index';
import { parseAuth0User } from '../../parseAuth0User';

VizPage.getPageData = async ({ gateways, params, auth0User }) => {
  const { id } = params;
  const { getInfo, getUser } = gateways;

  // Get the Info entity.
  const infoResult = await getInfo(id);
  if (infoResult.outcome === 'failure') {
    // Indicates viz not found
    return null;
  }

  const infoSnapshot = infoResult.value;
  const { title, owner } = infoSnapshot.data;

  // Get the User entity for the owner of the viz.
  const ownerUserResult = await getUser(owner);
  if (ownerUserResult.outcome === 'failure') {
    console.log('Error when fetching owner user:');
    console.log(ownerUserResult.error);
    return null;
  }
  const ownerUserSnapshot = ownerUserResult.value;

  const {
    authenticatedUserAvatarURL,
    authenticatedUserUserName,
    authenticatedUserId,
  } = parseAuth0User(auth0User);

  // Get the User entity for the currently authenticated user.
  // TODO batch this together so we make only one query against User collection
  // e.g. const getUsersResult = await getUsers([owner,authenticatedUserId]);

  const authenticatedUserResult = await getUser(authenticatedUserId);
  if (authenticatedUserResult.outcome === 'failure') {
    console.log('Error when fetching authenticated user:');
    console.log(authenticatedUserResult.error);
    return null;
  }
  const authenticatedUserSnapshot = authenticatedUserResult.value;

  return {
    infoSnapshot,
    ownerUserSnapshot,
    title,

    // TODO migrate to just expose `authenticauthenticatedUserSnapshotatedUser`
    authenticatedUserAvatarURL,
    authenticatedUserUserName,
    authenticatedUserId,

    authenticatedUserSnapshot,
  };
};

export { VizPage };

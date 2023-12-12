import { Snapshot, User, UserId } from 'entities';
import { parseAuth0Sub } from 'api';

export const getAuthenticatedUser = async ({
  gateways,
  auth0User,
}): Promise<{
  authenticatedUserId: string | undefined;
  authenticatedUserSnapshot: Snapshot<User> | undefined;
}> => {
  // If the user is currently authenticated...
  let authenticatedUserSnapshot:
    | Snapshot<User>
    | undefined = undefined;

  let authenticatedUserId: UserId | undefined = undefined;

  if (auth0User) {
    authenticatedUserId = parseAuth0Sub(auth0User.sub);

    // Get the User entity for the currently authenticated user.
    // TODO batch this together so we make only one query against User collection
    // e.g. const getUsersResult = await getUsers([owner,authenticatedUserId,forkedFromOwner]);

    const authenticatedUserResult = await gateways.getUser(
      authenticatedUserId,
    );
    if (authenticatedUserResult.outcome === 'failure') {
      console.log(
        'Error when fetching authenticated user:',
      );
      console.log(authenticatedUserResult.error);
      return {
        authenticatedUserId: undefined,
        authenticatedUserSnapshot: undefined,
      };
    }
    authenticatedUserSnapshot =
      authenticatedUserResult.value;
  }
  return { authenticatedUserId, authenticatedUserSnapshot };
};

import { UserId } from 'entities';

// Gets the VizHub user ID from the Auth0 user `sub` property.
export const parseAuth0Sub = (
  sub: string | undefined,
): UserId => {
  if (!sub) {
    throw new Error('Auth0 user has no sub property');
  }

  // Special case for GitHub users so that we can
  // use the old user IDs from the V2 migration and they
  // will still work in V3.
  return sub.startsWith('github') ? sub.substring(7) : sub;
};

export const parseAuth0User = (auth0User) => ({
  authenticatedUserAvatarURL: auth0User
    ? auth0User.picture
    : null,
  authenticatedUserUserName: auth0User
    ? auth0User.nickname
    : null,
  authenticatedUserId: auth0User
    ? parseAuth0Sub(auth0User.sub)
    : null,
});

export const getAuthenticatedUserId = (req) => {
  const auth0User = req?.oidc?.user || null;

  const { authenticatedUserId } = parseAuth0User(auth0User);

  return authenticatedUserId;
};

import { UserId } from 'entities';

// Gets the VizHub user ID from the Auth0 user `sub` property.
export const parseAuth0Sub = (sub: string): UserId =>
  sub.startsWith('github') ? sub.substring(7) : sub;

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

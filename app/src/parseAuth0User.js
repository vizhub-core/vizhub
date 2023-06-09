export const parseAuth0Sub = (sub) =>
  sub.startsWith('github') ? sub.substring(7) : sub;

export const parseAuth0User = (auth0User) => ({
  authenticatedUserAvatarURL: auth0User ? auth0User.picture : null,
  authenticatedUserUserName: auth0User ? auth0User.nickname : null,
  authenticatedUserId: auth0User ? parseAuth0Sub(auth0User.sub) : null,
});

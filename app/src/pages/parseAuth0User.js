export const parseAuth0User = (auth0User) => ({
  authenticatedUserAvatarURL: auth0User ? auth0User.picture : null,
  authenticatedUserUserName: auth0User ? auth0User.nickname : null,
  authenticatedUserId: auth0User ? auth0User.sub : null,
});

import { User } from 'entities';

// Gets the name to display to represent a user.
// Display `user.displayName` if it's populated.
// Otherwise fall back to `user.userName`.
// If `user` is null, return an empty string.
export const getUserDisplayName = (user: User) => {
  if (user) {
    if (
      user.displayName &&
      // Sometimes Auth0 returns an email address WTF!
      !user.displayName.endsWith('@gmail.com')
    ) {
      return user.displayName;
    } else {
      return user.userName;
    }
  } else {
    return '';
  }
};

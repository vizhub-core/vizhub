import { User } from 'entities';

const emailRegex = /\S+@\S+\.\S+/;
const isEmail = (str: string) => {
  return emailRegex.test(str);
};

// Gets the name to display to represent a user.
// Display `user.displayName` if it's populated.
// Otherwise fall back to `user.userName`.
// If `user` is null, return an empty string.
export const getUserDisplayName = (user: User) => {
  if (user) {
    if (
      user.displayName &&
      // Sometimes we get an email address here WTF!
      !isEmail(user.displayName)
    ) {
      return user.displayName;
    } else {
      return user.userName;
    }
  } else {
    return '';
  }
};

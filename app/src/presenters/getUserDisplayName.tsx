import { User } from 'entities';

// Gets the name to display to represent a user.
// Display `user.displayName` if it's populated.
// Otherwise fall back to `user.userName`.
export const getUserDisplayName = (user: User) =>
  user.displayName || user.userName;

import { User } from 'entities';
// Gets the href for a user's profile page.
export const getProfilePageHref = (user: User) => `/${user.userName}`;

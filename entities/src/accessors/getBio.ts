import { User } from 'entities';

export const getBio = (user: User) =>
  user ? user.bio || '' : '';

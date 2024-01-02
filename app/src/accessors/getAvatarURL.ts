import { User } from 'entities';

export const getAvatarURL = (user: User, width = 64) =>
  user.picture + '&size=64';

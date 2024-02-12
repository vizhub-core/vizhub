import { Info, User } from 'entities';
// Gets the href for a forks page.
export const getForksPageHref = (
  ownerUser: User,
  info: Info,
) => `/${ownerUser.userName}/${info.slug || info.id}/forks`;

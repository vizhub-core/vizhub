import { Info, User } from 'entities';
// Gets the href for a viz page.
export const getVizPageHref = (
  ownerUser: User,
  info: Info,
) => `/${ownerUser.userName}/${info.id}`;

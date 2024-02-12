import { Info, User } from 'entities';
// Gets the href for a stargazers page.
export const getStargazersPageHref = (
  ownerUser: User,
  info: Info,
) =>
  `/${ownerUser.userName}/${info.slug || info.id}/stargazers`;

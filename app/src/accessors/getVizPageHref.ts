import { Info, User } from 'entities';

let domain = '';

// If we're running in the browser, use the current domain.
if (typeof window !== 'undefined') {
  domain = window.location.origin;
}

// Gets the href for a viz page.
export const getVizPageHref = (
  ownerUser: User,
  info: Info,
  absolute = false,
) =>
  `${absolute ? domain : ''}/${ownerUser.userName}/${
    info.id
  }`;

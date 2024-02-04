import { Info, User } from 'entities';

let domain = '';

// If we're running in the browser, use the current domain.
if (typeof window !== 'undefined') {
  domain = window.location.origin;
}

// Gets the href for a viz page.
export const getVizPageHref = ({
  ownerUser,
  info,
  absolute = false,
  embedMode = false,
}: {
  ownerUser: User;
  info: Info;
  absolute?: boolean;
  embedMode?: boolean;
}) =>
  `${absolute ? domain : ''}/${ownerUser.userName}/${
    info.id
  }${embedMode ? '?mode=embed' : ''}`;

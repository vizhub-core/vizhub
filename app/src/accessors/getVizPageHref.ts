import { Info, User, absoluteURL } from 'entities';

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
  `${absolute ? absoluteURL('') : ''}/${ownerUser.userName}/${
    info.slug || info.id
  }${embedMode ? '?mode=embed' : ''}`;

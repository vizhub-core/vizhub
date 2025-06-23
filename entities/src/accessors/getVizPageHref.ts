import {
  CommitId,
  Info,
  User,
  absoluteURL,
} from 'entities';

// Gets the href for a viz page.
export const getVizPageHref = ({
  ownerUser,
  info,
  absolute = false,
  embedMode = false,
  commitId = undefined,
}: {
  ownerUser: User;
  info: Info;
  absolute?: boolean;
  embedMode?: boolean;
  commitId?: CommitId;
}) =>
  `${absolute ? absoluteURL('') : ''}/${ownerUser.userName}/${
    info.slug || info.id
  }${
    commitId ? `/${commitId}` : ''
  }${embedMode ? '?mode=embed' : ''}`;

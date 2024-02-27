import { Info, User, absoluteURL } from 'entities';

// Gets the href for a viz export as zip.
export const getVizExportHref = ({
  ownerUser,
  info,
  absolute = false,
}: {
  ownerUser: User;
  info: Info;
  absolute?: boolean;
}) =>
  `${absolute ? absoluteURL('') : ''}/api/get-viz/${ownerUser.userName}/${
    info.slug || info.id
  }.zip`;

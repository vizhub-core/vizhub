import { Info, User, absoluteURL } from 'entities';

// Gets the href for a viz export as zip.
export const getVizExportHref = ({
  ownerUser,
  info,
  runtimeVersion,
  absolute = false,
}: {
  ownerUser: User;
  info: Info;
  runtimeVersion: number;
  absolute?: boolean;
}) =>
  `${absolute ? absoluteURL('') : ''}/api/${
    runtimeVersion === 3
      ? // For v3 vizzes, we use the vite endpoint
        // which includes imported vizzes and yields a
        // runnable vite project.
        `export-viz/${ownerUser.userName}/${
          info.slug || info.id
        }/vite`
      : // For v2 vizzes, we use the get-viz endpoint
        // which just gets the raw files as .zip
        `get-viz/${ownerUser.userName}/${
          info.slug || info.id
        }.zip`
  }`;

import { useMemo } from 'react';
import {
  Info,
  Snapshot,
  User,
  getUserDisplayName,
} from 'entities';
import { VizPreview } from 'components/src/components/VizPreview';
import { useShareDBDocData } from '../useShareDBDocData';
import { getVizThumbnailURL } from '../accessors';

// The width in pixels of the thumbnail image
const thumbnailWidth = 300;

export const VizPreviewPresenter = ({
  infoSnapshot,
  ownerUser,
}: {
  infoSnapshot: Snapshot<Info>;
  ownerUser: User;
}) => {
  const info: Info = useShareDBDocData<Info>(
    infoSnapshot,
    'Info',
  );

  const { id, title, end, updated } = info;
  const { userName, picture } = ownerUser;

  const ownerName = useMemo(
    () => getUserDisplayName(ownerUser),
    [ownerUser],
  );

  const thumbnailImageURL = useMemo(
    () => getVizThumbnailURL(end, thumbnailWidth),
    [end, thumbnailWidth],
  );

  // // TODO add lastUpdatedDateFormatted
  // use updated
  // const lastUpdatedDateFormatted =
  //   useMemo();
  //   // () => formatLastUpdatedDate(lastUpdatedDate),
  //   // [lastUpdatedDate],

  return (
    <VizPreview
      title={title}
      thumbnailImageURL={thumbnailImageURL}
      ownerName={ownerName}
      ownerAvatarURL={picture}
      href={`/${userName}/${id}`}
    />
  );
};

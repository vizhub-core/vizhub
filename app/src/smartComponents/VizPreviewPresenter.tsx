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
import { formatTimestamp } from '../accessors/formatTimestamp';
import { getAvatarURL } from '../accessors/getAvatarURL';

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

  const {
    id,
    slug,
    title,
    end,
    updated,
    upvotesCount,
    forksCount,
    visibility,
    v3,
  } = info;
  const { userName } = ownerUser;

  const ownerName = useMemo(
    () => getUserDisplayName(ownerUser),
    [ownerUser],
  );

  const ownerAvatarURL = useMemo(
    () => getAvatarURL(ownerUser),
    [ownerUser],
  );

  const thumbnailImageURL = useMemo(
    () => getVizThumbnailURL(end, thumbnailWidth),
    [end, thumbnailWidth],
  );

  const lastUpdatedDateFormatted = useMemo(
    () => formatTimestamp(updated),
    [updated],
  );

  const href = useMemo(
    () => `/${userName}/${slug || id}`,
    [userName, id, slug],
  );

  return (
    <VizPreview
      title={title}
      thumbnailImageURL={thumbnailImageURL}
      lastUpdatedDateFormatted={lastUpdatedDateFormatted}
      ownerName={ownerName}
      ownerAvatarURL={ownerAvatarURL}
      href={href}
      upvotesCount={upvotesCount}
      forksCount={forksCount}
      visibility={visibility}
      isHot={v3}
    />
  );
};

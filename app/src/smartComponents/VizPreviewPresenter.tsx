import { useMemo } from 'react';
import {
  Info,
  Snapshot,
  User,
  getUserDisplayName,
  timestampToDate,
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

  const {
    id,
    title,
    end,
    updated,
    upvotesCount,
    forksCount,
    visibility,
  } = info;
  const { userName, picture } = ownerUser;

  const ownerName = useMemo(
    () => getUserDisplayName(ownerUser),
    [ownerUser],
  );

  const thumbnailImageURL = useMemo(
    () => getVizThumbnailURL(end, thumbnailWidth),
    [end, thumbnailWidth],
  );

  const lastUpdatedDateFormatted = useMemo(() => {
    const date = timestampToDate(updated);
    // Example: "January 1, 2020"
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [updated]);

  return (
    <VizPreview
      title={title}
      thumbnailImageURL={thumbnailImageURL}
      lastUpdatedDateFormatted={lastUpdatedDateFormatted}
      ownerName={ownerName}
      ownerAvatarURL={picture}
      href={`/${userName}/${id}`}
      upvotesCount={upvotesCount}
      forksCount={forksCount}
      visibility={visibility}
    />
  );
};

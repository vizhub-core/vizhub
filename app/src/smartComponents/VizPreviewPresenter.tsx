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

  const { id, title, end } = info;
  const { userName, picture } = ownerUser;

  const ownerName = useMemo(
    () => getUserDisplayName(ownerUser),
    [ownerUser],
  );

  const thumbnailImageURL = useMemo(
    () => getVizThumbnailURL(end),
    [end],
  );

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

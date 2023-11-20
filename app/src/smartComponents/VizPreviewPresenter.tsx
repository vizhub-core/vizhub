import { Info, Snapshot, User } from 'entities';
import { VizPreview } from 'components/src/components/VizPreview';
import { useShareDBDocData } from '../useShareDBDocData';
import { getUserDisplayName } from '../accessors/getUserDisplayName';
import { useMemo } from 'react';

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

  const { id, title } = info;
  const { userName, picture } = ownerUser;

  const ownerName = useMemo(
    () => getUserDisplayName(ownerUser),
    [ownerUser],
  );

  // TODO make this work for real
  // See https://github.com/vizhub-core/vizhub3/issues/65
  const thumbnailImageURL = useMemo(
    () => `/api/viz-thumbnail/${id}.png`,
    [id],
  );
  // const thumbnailImageURL = `https://vizhub.com/api/visualization/thumbnail/${info.id}.png`;

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

import { Info, Snapshot, User } from 'entities';
import { VizPreview } from 'components/src/components/VizPreview';
import { useShareDBDocData } from '../useShareDBDocData';
import { getUserDisplayName } from '../accessors/getUserDisplayName';

export const VizPreviewPresenter = ({
  infoSnapshot,
  ownerUser,
}: {
  infoSnapshot: Snapshot<Info>;
  ownerUser: User;
}) => {
  const info: Info = useShareDBDocData<Info>(infoSnapshot, 'Info').data;

  // TODO make this work for real
  // See https://github.com/vizhub-core/vizhub3/issues/65
  // const thumbnailImageURL = `/api/thumbnail/${id}.png`;
  const thumbnailImageURL = `https://vizhub.com/api/visualization/thumbnail/${info.id}.png`;

  return (
    <VizPreview
      title={info.title}
      thumbnailImageURL={thumbnailImageURL}
      ownerName={getUserDisplayName(ownerUser)}
      ownerAvatarURL={ownerUser.picture}
      href={`/${ownerUser.userName}/${info.id}`}
    />
  );
};

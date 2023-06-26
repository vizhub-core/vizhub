import { VizPreview } from 'components/src/components/VizPreview';
import { useShareDBDocData } from '../../useShareDBDocData';

export const VizPreviewPresenter = ({ infoSnapshot, ownerUser }) => {
  const info = useShareDBDocData(infoSnapshot, 'Info');

  // TODO make this work for real
  // See https://github.com/vizhub-core/vizhub3/issues/65
  // const thumbnailImageURL = `/api/thumbnail/${id}.png`;
  const thumbnailImageURL = `https://vizhub.com/api/visualization/thumbnail/${info.id}.png`;

  return (
    <VizPreview
      title={info.title}
      thumbnailImageURL={thumbnailImageURL}
      ownerName={ownerUser.displayName}
      ownerAvatarURL={ownerUser.picture}
      href={`/${ownerUser.userName}/${info.id}`}
    />
  );
};

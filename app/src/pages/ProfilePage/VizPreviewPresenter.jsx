import { timestampToDate } from 'entities';
import { VizPreview } from 'components/src/components/VizPreview';
import { useShareDBDocData } from '../../useShareDBDocData';

export const VizPreviewPresenter = ({ infoSnapshot, ownerUser }) => {
  const info = useShareDBDocData(infoSnapshot, 'Info');

  const { id, owner, title, updated, forksCount, upvotesCount } = info;
  const ownerName = ownerUser.displayName;
  const ownerAvatarURL = ownerUser.picture;

  // TODO make this work
  const thumbnailImageURL = `/api/thumbnail/${id}.png`;

  // TODO format this
  const lastUpdatedDateFormatted = timestampToDate(updated);

  const href = `/${ownerUser.userName}/${id}`;

  return (
    <VizPreview
      title={title}
      thumbnailImageURL={thumbnailImageURL}
      ownerName={ownerName}
      ownerAvatarURL={ownerAvatarURL}
      href={href}
    />
  );
};

import { useMemo } from 'react';
import {
  CommitId,
  Info,
  Snapshot,
  User,
  getUserDisplayName,
} from 'entities';
import { VizPreview } from 'components/src/components/VizPreview';
import { useShareDBDocData } from '../useShareDBDocData';
import { formatTimestamp } from '../accessors/formatTimestamp';
import { getAvatarURL } from '../accessors/getAvatarURL';

export const VizPreviewPresenter = ({
  infoSnapshot,
  ownerUser,
  thumbnailURLs,
}: {
  infoSnapshot: Snapshot<Info>;
  ownerUser: User;
  thumbnailURLs: Record<CommitId, string>;
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
      thumbnailImageURL={thumbnailURLs[end]}
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

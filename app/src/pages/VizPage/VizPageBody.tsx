import { useContext, useMemo } from 'react';
import { VizPageHead, ForkModal, VizPageViewer } from 'components';
import { AuthenticatedUserContext } from '../../contexts/AuthenticatedUserContext';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import { getUserDisplayName } from '../../accessors/getUserDisplayName';
import { Content, Info, User } from 'entities';
import { renderVizRunner } from './renderVizRunner';
import { useRenderMarkdownHTML } from './useRenderMarkdownHTML';
import { formatTimestamp } from '../../accessors/formatTimestamp';
import { getForksPageHref } from '../../accessors/getForksPageHref';
import { getProfilePageHref } from '../../accessors/getProfilePageHref';
import { getVizPageHref } from '../../accessors/getVizPageHref';

export const VizPageBody = ({
  info,
  content,
  ownerUser,
  showEditor,
  setShowEditor,
  onExportClick,
  onShareClick,
  showForkModal,
  toggleForkModal,
  onFork,
  initialReadmeHTML,
  forkedFromInfo,
  forkedFromOwnerUser,
}: {
  info: Info;
  content: Content;
  ownerUser: User;
  showEditor: boolean;
  setShowEditor: (showEditor: boolean) => void;
  onExportClick: () => void;
  onShareClick: () => void;
  showForkModal: boolean;
  toggleForkModal: () => void;
  onFork: () => void;
  initialReadmeHTML: string;
  forkedFromInfo: Info | null;
  forkedFromOwnerUser: User | null;
}) => {
  // The currently authenticated user, if any.
  const authenticatedUser: User | null = useContext(AuthenticatedUserContext);

  // The list of possible owners of a fork of this viz.
  const possibleForkOwners = useMemo(
    () =>
      authenticatedUser
        ? [
            {
              id: authenticatedUser.id,
              label: getUserDisplayName(authenticatedUser),
            },
          ]
        : [],
    [authenticatedUser]
  );

  // A function that renders markdown to HTML.
  // This supports server-rendering of markdown.
  const renderMarkdownHTML = useRenderMarkdownHTML(initialReadmeHTML);

  return (
    <div className="vh-page overflow-auto">
      <SmartHeader />
      <VizPageHead
        showEditor={showEditor}
        setShowEditor={setShowEditor}
        onExportClick={onExportClick}
        onShareClick={onShareClick}
        onForkClick={toggleForkModal}
      />
      <VizPageViewer
        vizTitle={info.title}
        vizHeight={content.height}
        renderVizRunner={renderVizRunner}
        renderMarkdownHTML={renderMarkdownHTML}
        authorDisplayName={getUserDisplayName(ownerUser)}
        authorAvatarURL={ownerUser.picture}
        createdDateFormatted={formatTimestamp(info.created)}
        updatedDateFormatted={formatTimestamp(info.updated)}
        forkedFromVizTitle={forkedFromInfo ? forkedFromInfo.title : null}
        forkedFromVizHref={
          forkedFromInfo
            ? getVizPageHref(forkedFromOwnerUser, forkedFromInfo)
            : null
        }
        forksCount={info.forksCount}
        forksPageHref={getForksPageHref(ownerUser, info)}
        ownerUserHref={getProfilePageHref(ownerUser)}
        upvotesCount={info.upvotesCount}
      />
      <ForkModal
        initialTitle={'Fork of ' + info.title}
        initialVisibility={info.visibility}
        initialOwner={authenticatedUser?.id}
        possibleOwners={possibleForkOwners}
        show={showForkModal}
        onClose={toggleForkModal}
        onFork={onFork}
      />
    </div>
  );
};

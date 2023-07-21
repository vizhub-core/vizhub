import { useCallback, useContext, useMemo } from 'react';
import { VizPageHead } from 'components/src/components/VizPageHead';
import { ForkModal } from 'components/src/components/ForkModal';
import { VizPageViewer } from 'components/src/components/VizPageViewer';
import { defaultVizWidth, defaultVizHeight } from 'entities';
import { AuthenticatedUserContext } from '../../contexts/AuthenticatedUserContext';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import { getUserDisplayName } from '../../accessors/getUserDisplayName';
import { Content, Info, User } from 'entities';
import { useRenderMarkdownHTML } from './useRenderMarkdownHTML';
import { formatTimestamp } from '../../accessors/formatTimestamp';
import { getForksPageHref } from '../../accessors/getForksPageHref';
import { getProfilePageHref } from '../../accessors/getProfilePageHref';
import { getVizPageHref } from '../../accessors/getVizPageHref';
import { getLicense } from '../../accessors/getLicense';
import { getHeight } from '../../accessors/getHeight';

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
  srcdoc,
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
  srcdoc: string;
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
    [authenticatedUser],
  );

  // A function that renders markdown to HTML.
  // This supports server-rendering of markdown.
  const renderMarkdownHTML = useRenderMarkdownHTML(initialReadmeHTML);

  // The license to display for this viz.
  const license = useMemo(() => getLicense(content), [content]);

  // The height of the viz, in pixels, falling back to default.
  const vizHeight = useMemo(() => getHeight(content.height), [content.height]);

  const renderVizRunner = useCallback(
    (iframeScale: number) => {
      return (
        <iframe
          width={defaultVizWidth}
          height={vizHeight}
          srcDoc={srcdoc}
          style={{
            transform: `scale(${iframeScale})`,
          }}
        />
      );
    },
    [srcdoc, vizHeight],
  );

  return (
    <div className="vh-page">
      <SmartHeader />
      <VizPageHead
        showEditor={showEditor}
        setShowEditor={setShowEditor}
        onExportClick={onExportClick}
        onShareClick={onShareClick}
        onForkClick={toggleForkModal}
        showForkButton={!!authenticatedUser}
      />
      <div className="vh-viz-page-body">
        {showEditor ? 'Sidebar' : null}

        <div className="right">
          <VizPageViewer
            vizTitle={info.title}
            vizHeight={vizHeight}
            defaultVizWidth={defaultVizWidth}
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
            license={license}
          />
        </div>
      </div>
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

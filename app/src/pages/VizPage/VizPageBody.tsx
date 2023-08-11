import { useCallback, useContext, useEffect, useMemo } from 'react';
import { Sidebar } from 'vzcode/src/client/Sidebar';
import { useTabsState } from 'vzcode/src/client/useTabsState';
import { TabList } from 'vzcode/src/client/TabList';
import { CodeEditor } from 'vzcode/src/client/CodeEditor';
import {
  defaultVizWidth,
  Content,
  Info,
  User,
  FileId,
  Files,
  UserId,
  Visibility,
} from 'entities';
import { VizPageHead } from 'components/src/components/VizPageHead';
import { ForkModal } from 'components/src/components/ForkModal';
import { VizPageViewer } from 'components/src/components/VizPageViewer';
import { AuthenticatedUserContext } from '../../contexts/AuthenticatedUserContext';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import { getUserDisplayName } from '../../accessors/getUserDisplayName';
import { useRenderMarkdownHTML } from './useRenderMarkdownHTML';
import { formatTimestamp } from '../../accessors/formatTimestamp';
import { getForksPageHref } from '../../accessors/getForksPageHref';
import { getProfilePageHref } from '../../accessors/getProfilePageHref';
import { getVizPageHref } from '../../accessors/getVizPageHref';
import { getLicense } from '../../accessors/getLicense';
import { getHeight } from '../../accessors/getHeight';
import { ShareDBDoc } from 'vzcode';

// The fixed path of the files in the ShareDB<Content> document.
const filesPath = ['files'];

export const VizPageBody = ({
  info,
  content,
  contentShareDBDoc,
  contentShareDBDocPresence,
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
  activeFileId,
  setActiveFileId,
  tabList,
  setTabList,
}: {
  info: Info;
  content: Content;
  contentShareDBDoc: ShareDBDoc<Content>;
  contentShareDBDocPresence: any;
  ownerUser: User;
  showEditor: boolean;
  setShowEditor: (showEditor: boolean) => void;
  onExportClick: () => void;
  onShareClick: () => void;
  showForkModal: boolean;
  toggleForkModal: () => void;
  onFork: ({
    owner,
    title,
    visibility,
  }: {
    owner: UserId;
    title: string;
    visibility: Visibility;
  }) => void;
  initialReadmeHTML: string;
  forkedFromInfo: Info | null;
  forkedFromOwnerUser: User | null;
  srcdoc: string;
  activeFileId: FileId | null;
  setActiveFileId: (activeFileId: FileId | null) => void;
  tabList: Array<FileId>;
  setTabList: (tabList: Array<FileId>) => void;
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

  // Render the viz runner iframe.
  const renderVizRunner = useCallback(
    (iframeScale: number) => (
      <iframe
        width={defaultVizWidth}
        height={vizHeight}
        srcDoc={srcdoc}
        style={{
          transform: `scale(${iframeScale})`,
        }}
      />
    ),
    [srcdoc, vizHeight],
  );

  // Logic for opening and closing tabs.
  const { closeTab, openTab } = useTabsState(
    activeFileId,
    setActiveFileId,
    tabList,
    setTabList,
  );

  const files: Files = content.files;

  // These are undefined during SSR, defined in the browser.
  const localPresence = contentShareDBDocPresence?.localPresence;
  const docPresence = contentShareDBDocPresence?.docPresence;

  // Re-run the program after users
  // stop typing for 1 second.
  useEffect(() => {
    // Debounce the updates by 100ms.
    const timeout = setTimeout(() => {
      // Update the files in the ShareDB<Content> document.

      console.log('TODO execute');
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [files]);

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
        {showEditor && files ? (
          <div className="left">
            <Sidebar files={files} handleFileClick={openTab} />
          </div>
        ) : null}
        {showEditor && activeFileId ? (
          <div className="middle">
            <TabList
              files={files}
              tabList={tabList}
              activeFileId={activeFileId}
              setActiveFileId={setActiveFileId}
              closeTab={closeTab}
            />
            {files && activeFileId ? (
              <CodeEditor
                shareDBDoc={contentShareDBDoc}
                filesPath={filesPath}
                activeFileId={activeFileId}
                localPresence={localPresence}
                docPresence={docPresence}

                // TODO make dynamic themes work
                // theme={theme}
              />
            ) : null}
          </div>
        ) : null}

        <div className={`right${showEditor ? ' editor-open' : ''}`}>
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
        currentPlan={authenticatedUser?.plan}
        pricingHref={'/pricing'}
      />
    </div>
  );
};

import {
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { Sidebar } from 'vzcode/src/client/Sidebar';
import { SplitPaneResizeContext } from 'vzcode/src/client/SplitPaneResizeContext';
import { Resizer } from 'vzcode/src/client/Resizer';
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
import { SettingsModal } from 'components/src/components/SettingsModal';
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
import { useRuntime } from './useRuntime';
import { getPackageJsonText } from '../../accessors/getPackageJsonText';
import { getPackageJson } from '../../accessors/getPackageJson';
import { PackageJson } from './v3Runtime/types';
import { VizSettings } from './useOnSettingsSave';
import { EditorCache } from 'vzcode/src/client/useEditorCache';

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
  initialSrcdoc,
  activeFileId,
  setActiveFileId,
  tabList,
  canUserEditViz,
  showSettingsModal,
  toggleSettingsModal,
  onSettingsSave,
  closeTab,
  openTab,
  createFile,
  handleRenameFileClick,
  handleDeleteFileClick,
  editorCache,
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
  initialSrcdoc: string;
  activeFileId: FileId | null;
  setActiveFileId: (activeFileId: FileId | null) => void;
  tabList: Array<FileId>;
  canUserEditViz: boolean;
  showSettingsModal: boolean;
  toggleSettingsModal: () => void;
  onSettingsSave: (vizSettings: VizSettings) => void;
  closeTab: (fileId: FileId) => void;
  openTab: (fileId: FileId) => void;
  createFile: () => void;
  handleRenameFileClick: (fileId: FileId) => void;
  handleDeleteFileClick: (
    fileId: FileId,
    event: React.MouseEvent,
  ) => void;
  editorCache: EditorCache;
}) => {
  // The currently authenticated user, if any.
  const authenticatedUser: User | null = useContext(
    AuthenticatedUserContext,
  );

  // The list of possible owners of a fork of this viz.
  // Also serves as the list of possible owners of a settings change.
  const possibleOwners: Array<{
    id: UserId;
    label: string;
  }> = useMemo(
    () =>
      authenticatedUser
        ? [
            {
              id: authenticatedUser.id,
              label: getUserDisplayName(authenticatedUser),
            },
            // TODO add orgs that the user is a member of.
          ]
        : [],
    [authenticatedUser],
  );

  // A function that renders markdown to HTML.
  // This supports server-rendering of markdown.
  const renderMarkdownHTML = useRenderMarkdownHTML(
    initialReadmeHTML,
  );

  // The license to display for this viz.
  const packageJsonText: string | null = useMemo(
    () => getPackageJsonText(content),
    [content],
  );
  const packageJson: PackageJson | null = useMemo(
    () => getPackageJson(packageJsonText),
    [packageJsonText],
  );
  const license = useMemo(
    () => getLicense(packageJson),
    [packageJson],
  );

  // The height of the viz, in pixels, falling back to default.
  const vizHeight = useMemo(
    () => getHeight(content.height),
    [content.height],
  );

  const files: Files = content.files;

  // These are undefined during SSR, defined in the browser.
  const localPresence =
    contentShareDBDocPresence?.localPresence;
  const docPresence =
    contentShareDBDocPresence?.docPresence;

  // The ref to the viz runner iframe.
  const iframeRef: RefObject<HTMLIFrameElement> =
    useRef<HTMLIFrameElement>(null);

  // Set up the runtime environment.
  useRuntime({ content, iframeRef });

  // Render the viz runner iframe.
  const renderVizRunner = useCallback(
    (iframeScale: number) => (
      <iframe
        ref={iframeRef}
        width={defaultVizWidth}
        height={vizHeight}
        srcDoc={initialSrcdoc}
        style={{
          transform: `scale(${iframeScale})`,
        }}
      />
    ),
    [initialSrcdoc, vizHeight],
  );

  // Disable pointer events when split pane is being dragged.
  // Otherwise, they do interfere with dragging the split pane.
  // Inspired by https://github.com/vizhub-core/vizhub/blob/01cadfb78a2611df32f981b1fd8136b70447de9e/vizhub-v2/packages/neoFrontend/src/pages/VizPage/VizRunnerContext/index.js#L15
  const { isDragging } = useContext(SplitPaneResizeContext);
  useEffect(() => {
    if (!iframeRef.current) return;
    iframeRef.current.style['pointer-events'] = isDragging
      ? 'none'
      : 'all';
  }, [isDragging]);

  // The formatted created date.
  const createdDateFormatted = useMemo(
    () => formatTimestamp(info.created),
    [info.created],
  );

  // The formatted updated date.
  const updatedDateFormatted = useMemo(
    () => formatTimestamp(info.updated),
    [info.updated],
  );

  // The display name of the author.
  const authorDisplayName = useMemo(
    () => getUserDisplayName(ownerUser),
    [ownerUser],
  );

  // The href to the forked-from viz.
  const forkedFromVizHref = useMemo(
    () =>
      forkedFromInfo
        ? getVizPageHref(
            forkedFromOwnerUser,
            forkedFromInfo,
          )
        : null,
    [forkedFromInfo, forkedFromOwnerUser],
  );

  // The href to the forks page.
  const forksPageHref = useMemo(
    () => getForksPageHref(ownerUser, info),
    [ownerUser, info],
  );

  // The href to the owner's profile page.
  const ownerUserHref = useMemo(
    () => getProfilePageHref(ownerUser),
    [ownerUser],
  );

  // const handleRenameFileClick = useCallback(
  //   (fileId: FileId) => {
  //     const newTitle = prompt('Enter a new title for the file:');
  //     if (newTitle) {
  //       submitOp(
  return (
    <div className="vh-page">
      <SmartHeader />
      <VizPageHead
        showEditor={showEditor}
        setShowEditor={setShowEditor}
        onExportClick={onExportClick}
        onShareClick={onShareClick}
        showForkButton={!!authenticatedUser}
        onForkClick={toggleForkModal}
        showSettingsButton={canUserEditViz}
        onSettingsClick={toggleSettingsModal}
      />
      <div className="vh-viz-page-body">
        {showEditor && files ? (
          <div className="left">
            {/* createFile={createFile}
          files={files}
          handleRenameFileClick={handleRenameFileClick}
          handleDeleteFileClick={handleDeleteFileClick}
          handleFileClick={openTab}
          setIsSettingsOpen={setIsSettingsOpen}
          isDirectoryOpen={isDirectoryOpen}
          toggleDirectory={toggleDirectory} */}
            <Sidebar
              files={files}
              handleFileClick={openTab}
              // handleRenameFileClick={handleRenameFileClick}
              createFile={createFile}
              // files={files}
              handleRenameFileClick={handleRenameFileClick}
              handleDeleteFileClick={handleDeleteFileClick}
              // handleFileClick={openTab}
              // setIsSettingsOpen={setIsSettingsOpen}
              // isDirectoryOpen={isDirectoryOpen}
              // toggleDirectory={toggleDirectory}
            />
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
                editorCache={editorCache}

                // TODO make dynamic themes work
                // theme={theme}
              />
            ) : null}
          </div>
        ) : null}
        {showEditor ? <Resizer /> : null}

        <div
          className={`right${
            showEditor ? ' editor-open' : ''
          }`}
        >
          <VizPageViewer
            vizTitle={info.title}
            vizHeight={vizHeight}
            defaultVizWidth={defaultVizWidth}
            renderVizRunner={renderVizRunner}
            renderMarkdownHTML={renderMarkdownHTML}
            authorDisplayName={authorDisplayName}
            authorAvatarURL={ownerUser.picture}
            createdDateFormatted={createdDateFormatted}
            updatedDateFormatted={updatedDateFormatted}
            forkedFromVizTitle={
              forkedFromInfo ? forkedFromInfo.title : null
            }
            forkedFromVizHref={forkedFromVizHref}
            forksCount={info.forksCount}
            forksPageHref={forksPageHref}
            ownerUserHref={ownerUserHref}
            upvotesCount={info.upvotesCount}
            license={license}
            isPrivate={info.visibility === 'private'}
            isUnlisted={info.visibility === 'unlisted'}
          />
        </div>
      </div>
      {showForkModal ? (
        <ForkModal
          initialTitle={'Fork of ' + info.title}
          initialVisibility={info.visibility}
          initialOwner={authenticatedUser?.id}
          possibleOwners={possibleOwners}
          show={showForkModal}
          onClose={toggleForkModal}
          onFork={onFork}
          currentPlan={authenticatedUser?.plan}
          pricingHref={'/pricing'}
        />
      ) : null}
      {showSettingsModal ? (
        <SettingsModal
          initialTitle={info.title}
          initialVisibility={info.visibility}
          initialOwner={info.owner}
          possibleOwners={possibleOwners}
          show={showSettingsModal}
          onClose={toggleSettingsModal}
          onSave={onSettingsSave}
          currentPlan={authenticatedUser?.plan}
          pricingHref={'/pricing'}
        />
      ) : null}
    </div>
  );
};

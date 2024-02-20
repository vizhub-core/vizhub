import {
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ShareDBDoc,
  SplitPaneResizeContext,
  FileId,
} from 'vzcode';
import {
  defaultVizWidth,
  Content,
  Info,
  User,
  getPackageJsonText,
  V3PackageJson,
  getPackageJson,
  getLicense,
  getHeight,
  getUserDisplayName,
  VizId,
  SlugKey,
  getVizThumbnailURL,
  FREE,
} from 'entities';
import { useRuntime } from 'runtime';
import {
  VizPageHead,
  VizPageUpgradeBanner,
  VizPageViewer,
} from 'components';
import { AuthenticatedUserContext } from '../../../contexts/AuthenticatedUserContext';
import { SmartHeader } from '../../../smartComponents/SmartHeader';
import {
  getForksPageHref,
  getProfilePageHref,
  getVizPageHref,
} from '../../../accessors';
import { useRenderMarkdownHTML } from './useRenderMarkdownHTML';
import { VizPageEditor } from './VizPageEditor';
import { useMarkUncommitted } from '../useMarkUncommitted';
import { formatTimestamp } from '../../../accessors/formatTimestamp';
import { LogoSVG } from 'components/src/components/Icons/LogoSVG';
import { getStargazersPageHref } from '../../../accessors/getStargazersPageHref';
import { useBrandedEmbedNotice } from './useBrandedEmbedNotice';

const debug = false;

export const VizPageBody = ({
  info,
  content,
  contentShareDBDoc,
  contentShareDBDocPresence,
  ownerUser,
  forkedFromInfo,
  forkedFromOwnerUser,
  showEditor,
  setShowEditor,
  onExportClick,
  toggleForkModal,
  initialReadmeHTML,
  toggleSettingsModal,
  toggleShareModal,
  initialSrcdoc,
  initialSrcdocError,
  canUserEditViz,
  canUserDeleteViz,
  setVizTitle,
  submitContentOperation,
  toggleDeleteVizConfirmationModal,
  vizCacheContents,
  setUncommitted,
  isUpvoted,
  handleUpvoteClick,
  slugResolutionCache,
  isEmbedMode,
  isEmbedBrandedURLParam,
  isHideMode,
  toggleAIAssistUpgradeNudgeModal,
}: {
  info: Info;
  content: Content;
  contentShareDBDoc: ShareDBDoc<Content>;
  contentShareDBDocPresence: any;
  ownerUser: User;
  forkedFromInfo: Info | null;
  forkedFromOwnerUser: User | null;
  showEditor: boolean;
  setShowEditor: (showEditor: boolean) => void;
  onExportClick: () => void;
  toggleForkModal: () => void;
  initialReadmeHTML: string;
  toggleSettingsModal: () => void;
  toggleShareModal: () => void;
  initialSrcdoc: string;
  initialSrcdocError: string | null;
  canUserEditViz: boolean;
  canUserDeleteViz: boolean;
  setVizTitle: (title: string) => void;
  submitContentOperation: (
    next: (content: Content) => Content,
  ) => void;
  toggleDeleteVizConfirmationModal: () => void;
  vizCacheContents: Record<string, Content>;
  setUncommitted: (authenticatedUser: User | null) => void;
  isUpvoted: boolean;
  handleUpvoteClick: () => void;
  slugResolutionCache: Record<SlugKey, VizId>;
  isEmbedMode: boolean;
  isEmbedBrandedURLParam: boolean;
  isHideMode: boolean;
  toggleAIAssistUpgradeNudgeModal: () => void;
}) => {
  // The currently authenticated user, if any.
  const authenticatedUser: User | null = useContext(
    AuthenticatedUserContext,
  );

  // Marks the viz as uncommitted and adds the
  // authenticated user to the list of commit authors.
  useMarkUncommitted({
    contentShareDBDoc,
    setUncommitted,
    authenticatedUser,
  });

  if (debug) {
    // Log the info object for debugging the commit authors.
    console.log('[VizPageBody] Info:');
    console.log(JSON.stringify(info, null, 2));
  }

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
  const packageJson: V3PackageJson | null = useMemo(
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

  // The ref to the viz runner iframe.
  const iframeRef: RefObject<HTMLIFrameElement> =
    useRef<HTMLIFrameElement>(null);

  // TODO
  // * [ ] clear this out on local build & qa that it works
  // * [ ] update this from client-side Rollup errors & QA that it works
  const [srcdocErrorMessage, setSrcdocErrorMessage] =
    useState<string | null>(initialSrcdocError);

  const setSrcdocError = useCallback(
    (errorMessage: string | null) => {
      setSrcdocErrorMessage(errorMessage);
    },
    [],
  );

  // Allow vizzes to just be documentation / articles
  // if there is only one file and that file is README.md.
  const isVisual = useMemo(() => {
    const fileIds: Array<FileId> = Object.keys(
      content.files,
    );
    const isSingleFile =
      Object.keys(content.files).length === 1;
    const isReadme =
      content.files[fileIds[0]]?.name === 'README.md';
    return !(isSingleFile && isReadme);
  }, [content]);

  // Set up the runtime environment.
  useRuntime({
    content,
    iframeRef,
    setSrcdocError,
    vizCacheContents,
    isVisual,
    slugResolutionCache,
  });

  // Render the viz runner iframe.
  const renderVizRunner = useCallback(
    (iframeScale?: number) =>
      isHideMode ? null : (
        <iframe
          ref={iframeRef}
          srcDoc={initialSrcdoc}
          {...(isEmbedMode
            ? {
                style: {
                  position: 'absolute',
                  width: '100vw',
                  height: '100vh',
                },
              }
            : {
                width: defaultVizWidth,
                height: vizHeight,
                style: {
                  transform: `scale(${iframeScale})`,
                },
              })}
        />
      ),
    [initialSrcdoc, vizHeight, isEmbedMode, isHideMode],
  );

  // Disable pointer events when split pane is being dragged.
  // Otherwise, they do interfere with dragging the split pane.
  // Inspired by https://github.com/vizhub-core/vizhub/blob/01cadfb78a2611df32f981b1fd8136b70447de9e/vizhub-v2/packages/neoFrontend/src/pages/VizPage/VizRunnerContext/index.js#L15
  const { isDraggingLeft, isDraggingRight } = useContext(
    SplitPaneResizeContext,
  );
  useEffect(() => {
    if (!iframeRef.current) return;
    const isDragging = isDraggingLeft || isDraggingRight;
    iframeRef.current.style['pointer-events'] = isDragging
      ? 'none'
      : 'all';
  }, [isDraggingLeft, isDraggingRight]);

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
        ? getVizPageHref({
            ownerUser: forkedFromOwnerUser,
            info: forkedFromInfo,
          })
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

  const downloadImageHref = useMemo(
    () => getVizThumbnailURL(info.end, defaultVizWidth),
    [info.end, defaultVizWidth],
  );

  const fullscreenHref = useMemo(
    () =>
      getVizPageHref({
        ownerUser,
        info,
        embedMode: true,
      }),
    [ownerUser, info],
  );

  const stargazersHref = useMemo(
    () => getStargazersPageHref(ownerUser, info),
    [fullscreenHref],
  );

  const [
    isUpgradeBannerVisible,
    setIsUpgradeBannerVisible,
  ] = useState(
    // Only shoe the banner if:
    // - the user is authenticated
    // - the user is on the free plan
    // - the viz is public
    // - the viz is their own
    authenticatedUser?.plan === FREE &&
      info.visibility === 'public' &&
      info.owner === authenticatedUser?.id,
  );

  const handleUpgradeBannerClose = useCallback(() => {
    setIsUpgradeBannerVisible(false);
  }, []);

  const isUserAuthenticated = !!authenticatedUser;

  // Should we show the viz embed branded?
  // If the URL param is set, definitely show it.
  // Otherwise, show it if:
  // - The owner is on the free plan AND
  // - The owner is not the authenticated user
  const isEmbedBranded = useMemo(
    () =>
      isEmbedBrandedURLParam ||
      (ownerUser.plan === FREE &&
        ownerUser.id !== authenticatedUser?.id),
    [isEmbedBrandedURLParam, ownerUser, authenticatedUser],
  );

  useBrandedEmbedNotice({
    isEmbedMode,
    isEmbedBrandedURLParam,
    isEmbedBranded,
  });

  return isEmbedMode ? (
    <>
      {renderVizRunner()}
      {isEmbedBranded && (
        <a
          href={getVizPageHref({
            ownerUser,
            info,
            absolute: true,
          })}
          style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
          }}
        >
          <LogoSVG />
        </a>
      )}
    </>
  ) : (
    <div className="vh-page">
      <SmartHeader />
      <VizPageHead
        showEditor={showEditor}
        setShowEditor={setShowEditor}
        onExportClick={onExportClick}
        onShareClick={toggleShareModal}
        showForkButton={isUserAuthenticated}
        onForkClick={toggleForkModal}
        showSettingsButton={canUserEditViz}
        onSettingsClick={toggleSettingsModal}
        showTrashButton={canUserDeleteViz}
        onTrashClick={toggleDeleteVizConfirmationModal}
        downloadImageHref={downloadImageHref}
      />
      {isUpgradeBannerVisible && (
        <VizPageUpgradeBanner
          onClose={handleUpgradeBannerClose}
        />
      )}
      <div className="vh-viz-page-body">
        <VizPageEditor
          showEditor={showEditor}
          content={content}
          contentShareDBDoc={contentShareDBDoc}
          contentShareDBDocPresence={
            contentShareDBDocPresence
          }
          srcdocErrorMessage={srcdocErrorMessage}
          authenticatedUser={authenticatedUser}
          submitContentOperation={submitContentOperation}
          toggleAIAssistUpgradeNudgeModal={
            toggleAIAssistUpgradeNudgeModal
          }
        />
        {isHideMode ? null : (
          <div
            className={`right${
              showEditor ? ' editor-open' : ''
            }`}
          >
            <VizPageViewer
              vizTitle={info.title}
              enableEditingTitle={canUserEditViz}
              setVizTitle={setVizTitle}
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
              isVisual={isVisual}
              isUpvoted={isUpvoted}
              handleUpvoteClick={handleUpvoteClick}
              fullscreenHref={fullscreenHref}
              stargazersHref={stargazersHref}
              onForkClick={toggleForkModal}
              isUserAuthenticated={isUserAuthenticated}
            />
          </div>
        )}
      </div>
    </div>
  );
};

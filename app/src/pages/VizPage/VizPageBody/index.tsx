import {
  useContext,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import {
  RevisionHistoryNavigator,
  VizPageHead,
  VizPageUpgradeBanner,
  VizPageVersionBanner,
  VizPageViewer,
} from 'components';
import { AIStreamingDisplay } from 'components/src/components/EditWithAIModal/AIStreamingDisplay';
import { SmartHeader } from '../../../smartComponents/SmartHeader';
import { VizPageEditor } from './VizPageEditor';
import { useVizPageState } from './useVizPageState';
import { useVizRunnerSetup } from './useVizRunnerSetup';
import { VizPageEmbed } from './VizPageEmbed';
import { VizPageContext } from '../VizPageContext';
import { formatCommitTimestamp } from 'components/src/components/formatCommitTimestamp';
import { useComments } from './useComments';
import { useRenderMarkdownHTML } from './useRenderMarkdownHTML';
import { useMarkUncommitted } from '../useMarkUncommitted';
import { useBrandedEmbedNotice } from './useBrandedEmbedNotice';
import {
  getForksPageHref,
  getProfilePageHref,
  getStargazersPageHref,
  getAvatarURL,
} from '../../../accessors';

import { getVizPageHref } from 'entities/src/accessors';

import {
  defaultVizWidth,
  getPackageJsonText,
  getPackageJson,
  getLicense,
  getHeight,
  getUserDisplayName,
  FREE,
  PREMIUM,
  PRO,
} from 'entities';
import { formatTimestamp } from '../../../accessors/formatTimestamp';
import { VizFileId } from '@vizhub/viz-types';
import { useRuntime } from '../runtime/useRuntime';

const enableVizPageUpgradeBanner = false;

export const VizPageBody = () => {
  const {
    info,
    content,
    contentShareDBDoc,
    contentShareDBDocPresence,
    ownerUser,
    forkedFromInfo,
    forkedFromOwnerUser,
    showEditor,
    setShowEditor,
    exportHref,
    downloadImageHref,
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
    isFileOpen,
    initialComments,
    initialCommentAuthors,
    vizKit,
    connected,
    showRevisionHistory,
    revisionHistory,
    toggleShowRevisionHistory,
    restoreToRevision,
    commitMetadata,
    toggleExportCodeUpgradeNudgeModal,
    toggleEditWithAIModal,
    isEditingWithAI,
    runtimeVersion,
    aiStreamingContent,
    showAIStreaming,
    aiStatus,
  } = useContext(VizPageContext);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const {
    isUpgradeBannerVisible,
    handleUpgradeBannerClose,
    isUserAuthenticated,
    hideTopBar,
    authenticatedUser,
  } = useVizPageState();

  const {
    renderVizRunner,
    srcdocErrorMessage,
    setSrcdocErrorMessage,
  } = useVizRunnerSetup(
    iframeRef,
    initialSrcdoc,
    getHeight(content.height),
    isEmbedMode,
    isHideMode,
    defaultVizWidth,
  );

  const {
    commentsFormatted,
    handleCommentSubmit,
    handleCommentDelete,
  } = useComments({
    vizId: info.id,
    initialComments,
    initialCommentAuthors,
    authenticatedUser,
    vizKit,
  });

  const renderMarkdownHTML = useRenderMarkdownHTML(
    initialReadmeHTML,
  );

  useMarkUncommitted({
    contentShareDBDoc,
    setUncommitted,
    authenticatedUser,
  });

  useRuntime({
    content,
    iframeRef,
    srcdocErrorMessage,
    setSrcdocErrorMessage,
    vizCacheContents,
    isVisual: !isSingleReadmeFile(content.files),
    slugResolutionCache,
    submitContentOperation,
  });

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

  const handleRestoreToVersionClick = useCallback(() => {
    if (commitMetadata) {
      restoreToRevision(commitMetadata.id);
    }
  }, [commitMetadata, restoreToRevision]);

  const vizPageViewerProps = {
    vizTitle: info.title,
    enableEditingTitle: canUserEditViz,
    setVizTitle,
    vizHeight: getHeight(content.height),
    defaultVizWidth,
    renderVizRunner,
    renderMarkdownHTML,
    authorDisplayName: getUserDisplayName(ownerUser),
    authorAvatarURL: ownerUser.picture,
    createdDateFormatted: formatTimestamp(info.created),
    updatedDateFormatted: formatTimestamp(info.updated),
    forkedFromVizTitle: forkedFromInfo?.title || null,
    forkedFromVizHref: forkedFromInfo
      ? getVizPageHref({
          ownerUser: forkedFromOwnerUser,
          info: forkedFromInfo,
        })
      : null,
    forksCount: info.forksCount,
    forksPageHref: getForksPageHref(ownerUser, info),
    ownerUserHref: getProfilePageHref(ownerUser),
    upvotesCount: info.upvotesCount,
    license: getLicense(
      getPackageJson(getPackageJsonText(content)),
    ),
    visibility: info.visibility,
    isVisual: !isSingleReadmeFile(content.files),
    isUpvoted,
    handleUpvoteClick,
    fullscreenHref: getVizPageHref({
      ownerUser,
      info,
      embedMode: true,
    }),
    stargazersHref: getStargazersPageHref(ownerUser, info),
    onForkClick: toggleForkModal,
    isUserAuthenticated,
    commentsFormatted,
    handleCommentSubmit,
    authenticatedUserAvatarURL: authenticatedUser
      ? getAvatarURL(authenticatedUser)
      : null,
    handleCommentDelete,
    runtimeVersion,
  };

  if (isEmbedMode) {
    return (
      <VizPageEmbed
        renderVizRunner={renderVizRunner}
        isEmbedBranded={isEmbedBranded}
        ownerUser={ownerUser}
        info={info}
      />
    );
  }

  return (
    <div className="vh-page">
      {!hideTopBar && <SmartHeader />}

      {showRevisionHistory && (
        <RevisionHistoryNavigator
          revisionHistory={revisionHistory}
          info={info}
          content={content}
          getVizPageHrefForCommit={(commitId: string) =>
            getVizPageHref({ ownerUser, info, commitId })
          }
        />
      )}

      <VizPageHead
        showForkButton={isUserAuthenticated}
        showSettingsButton={
          canUserEditViz && !commitMetadata
        }
        showTrashButton={
          canUserDeleteViz && !commitMetadata
        }
        showExportButton={!commitMetadata}
        showShareButton={!commitMetadata}
        showImageButton={!commitMetadata}
        showEditor={showEditor}
        setShowEditor={setShowEditor}
        userCanExport={
          authenticatedUser?.plan === PREMIUM ||
          authenticatedUser?.plan === PRO
        }
        userCanEditWithAI={canUserEditViz}
        exportHref={exportHref}
        onShareClick={toggleShareModal}
        onForkClick={toggleForkModal}
        onSettingsClick={toggleSettingsModal}
        onTrashClick={toggleDeleteVizConfirmationModal}
        downloadImageHref={downloadImageHref}
        toggleShowRevisionHistory={
          toggleShowRevisionHistory
        }
        toggleExportCodeUpgradeNudgeModal={
          toggleExportCodeUpgradeNudgeModal
        }
        onEditWithAIClick={toggleEditWithAIModal}
        isEditingWithAI={isEditingWithAI}
      />

      {enableVizPageUpgradeBanner &&
        isUpgradeBannerVisible &&
        !commitMetadata && (
          <VizPageUpgradeBanner
            onClose={handleUpgradeBannerClose}
          />
        )}

      {commitMetadata && (
        <VizPageVersionBanner
          commitTimestampFormatted={formatCommitTimestamp(
            commitMetadata.timestamp,
          )}
          onRestoreToVersionClick={
            handleRestoreToVersionClick
          }
          showRestoreButton={!!authenticatedUser}
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
          connected={connected}
        />

        {!isHideMode && (
          <div
            className={`right${showEditor ? ' editor-open' : ''}`}
          >
            <VizPageViewer {...vizPageViewerProps} />
          </div>
        )}
      </div>

      <AIStreamingDisplay
        content={aiStreamingContent}
        isVisible={showAIStreaming}
        status={aiStatus}
      />
    </div>
  );
};

// Helper function to determine if viz only contains a single README.md file
const isSingleReadmeFile = (
  files: Record<VizFileId, any>,
) => {
  const fileIds = files ? Object.keys(files) : [];
  return (
    fileIds.length === 1 &&
    files[fileIds[0]]?.name === 'README.md'
  );
};

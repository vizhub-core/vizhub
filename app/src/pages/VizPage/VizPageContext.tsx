import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { VizPageData } from './VizPageData';
import { VizKitAPI } from 'api/src/VizKit';
import { useShareDBConnectionStatus } from '../../useShareDBConnectionStatus';
import { ShareDBDoc, useSubmitOperation } from 'vzcode';
import {
  Comment,
  CommitId,
  CommitMetadata,
  Info,
  RevisionHistory,
  SlugKey,
  Snapshot,
  User,
  UserId,
  Visibility,
} from 'entities';
import {
  useData,
  useDataRecord,
  useShareDBDoc,
  useShareDBDocData,
  useShareDBDocPresence,
  useShareDBDocs,
} from '../../useShareDBDocData';
import { useToggleState } from './useToggleState';
import { useShareDBError } from './useShareDBError';
import { useOnFork } from './useOnFork';
import { useURLState } from './useURLState';
import { useSlugAutoNavigate } from './useSlugAutoNavigate';
import {
  VizSettings,
  useOnSettingsSave,
  useSetAnyoneCanEdit,
  useSetUncommitted,
  useSetVizTitle,
} from './useVizMutations';
import { useUpvoting } from './useUpvoting';
import { getVizExportHref } from '../../accessors/getVizExportHref';
import { VizHubError } from 'gateways';
import { useRevisionHistory } from './useRevisionHistory';
import { useOnEditWithAI } from './useOnEditWithAI';
import { VizContent, VizId } from '@vizhub/viz-types';
import {
  determineRuntimeVersion,
  runtimeVersion,
} from '@vizhub/runtime';
import { vizFilesToFileCollection } from '@vizhub/viz-utils';

export type VizPageContextValue = {
  info: Info;
  content: VizContent;
  contentShareDBDoc: ShareDBDoc<VizContent>;
  contentShareDBDocPresence: any;
  ownerUser: User;
  forkedFromInfo: Info | null;
  forkedFromOwnerUser: User | null;
  showEditor: boolean;
  setShowEditor: (showEditor: boolean) => void;
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
    next: (content: VizContent) => VizContent,
  ) => void;
  toggleDeleteVizConfirmationModal: () => void;
  vizCacheContents: Record<string, VizContent>;
  setUncommitted: (authenticatedUser: User | null) => void;
  isUpvoted: boolean;
  handleUpvoteClick: () => void;
  slugResolutionCache: Record<SlugKey, VizId>;
  isEmbedMode: boolean;
  isEmbedBrandedURLParam: boolean;
  isHideMode: boolean;
  toggleAIAssistUpgradeNudgeModal: () => void;
  isFileOpen: boolean;
  initialComments: Array<Snapshot<Comment>>;
  initialCommentAuthors: Array<Snapshot<User>>;
  vizKit: VizKitAPI;
  connected: boolean;
  // handleExportCodeClick: () => void;
  exportHref: string;
  shareDBError: VizHubError | null;
  setShareDBError: (error: VizHubError) => void;
  dismissShareDBError: () => void;
  handleForkLinkClick: (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => void;
  showForkModal: boolean;
  onFork: ({
    owner,
    title,
    visibility,
    commitId,
  }: {
    owner: UserId;
    title: string;
    visibility: Visibility;
    commitId: CommitId;
  }) => void;
  showSettingsModal: boolean;
  showShareModal: boolean;
  onSettingsSave: (vizSettings: VizSettings) => void;
  setAnyoneCanEdit: (anyoneCanEdit: boolean) => void;
  showDeleteVizConfirmationModal: boolean;
  initialCollaborators: Array<User>;
  showAIAssistUpgradeNudgeModal: boolean;
  showExportCodeUpgradeNudgeModal: boolean;
  toggleExportCodeUpgradeNudgeModal: () => void;
  showRevisionHistory: boolean;
  toggleShowRevisionHistory: () => void;
  restoreToRevision: (commitId: CommitId) => void;

  // null signifies that the data is still loading.
  revisionHistory: RevisionHistory | null;
  commitMetadata?: CommitMetadata;
  runtimeVersion: runtimeVersion;

  toggleEditWithAIModal: () => void;
  showEditWithAIModal: boolean;
  onEditWithAI: (prompt: string) => void;
  isEditingWithAI: boolean;

  modelName: string;
  setModelName: (modelName: string) => void;
  modelNameOptions: string[];
};

export const VizPageContext =
  createContext<VizPageContextValue | null>(null);

export const VizPageProvider = ({
  children,
  pageData,
  vizKit,
}: {
  children: React.ReactNode;
  pageData: VizPageData;
  vizKit: VizKitAPI;
}) => {
  // Unpack server-rendered data.
  const {
    infoSnapshot,
    infoStatic,
    ownerUserSnapshot,
    initialReadmeHTML,
    forkedFromInfoSnapshot,
    forkedFromOwnerUserSnapshot,
    canUserEditViz,
    canUserDeleteViz,
    initialCollaborators,
    initialIsUpvoted,
    initialComments,
    initialCommentAuthors,
    buildVizResult,
    commitMetadata,
  } = pageData;

  const {
    initialSrcdoc,
    initialSrcdocError,
    slugResolutionCache,
  } = buildVizResult;

  // All of these declarations that follow are defined differently
  // depending on whether the viz is at a specific version or live.

  let info: Info;
  let submitInfoOperation:
    | ((next: (data: Info) => Info) => void)
    | undefined;
  let connected: boolean;
  let vizCacheShareDBDocs:
    | Record<string, ShareDBDoc<VizContent>>
    | undefined;
  let vizCacheContents:
    | Record<string, VizContent>
    | undefined;
  let contentShareDBDoc: ShareDBDoc<VizContent> | undefined;

  // If we are loading a specific version of the viz...
  if (buildVizResult.type === 'versioned') {
    const { vizCacheContentsStatic } = buildVizResult;

    // Set up the static Info.
    info = infoStatic;

    // If we are the viz at a specific version,
    // we do not need to connect to ShareDB at all.
    connected = false;

    // The viz cache, used for resolving imported vizzes,
    // uses the static viz cache contents from the server.
    vizCacheContents = vizCacheContentsStatic;
  }

  // If we are loading a live viz (most typical scenario)...
  else if (buildVizResult.type === 'live') {
    const { vizCacheContentSnapshots } = buildVizResult;

    // Set up the live Info ShareDB doc.
    const infoShareDBDoc: ShareDBDoc<Info> =
      useShareDBDoc<Info>(infoSnapshot, 'Info');
    info = useData(infoSnapshot, infoShareDBDoc);
    submitInfoOperation =
      useSubmitOperation<Info>(infoShareDBDoc);

    // If we are the live viz, we need to connect to ShareDB.
    connected = useShareDBConnectionStatus().connected;

    // The viz cache, used for resolving imported vizzes,
    // is always kept up to date via ShareDB docs.
    vizCacheShareDBDocs = useShareDBDocs<VizContent>(
      vizCacheContentSnapshots,
      'Content',
    );
    vizCacheContents = useDataRecord(
      vizCacheContentSnapshots,
      vizCacheShareDBDocs,
    );

    contentShareDBDoc = vizCacheShareDBDocs[info.id];
  }

  let content: VizContent = vizCacheContents[info.id];

  const submitContentOperation: (
    next: (content: VizContent) => VizContent,
  ) => void = useSubmitOperation<VizContent>(
    contentShareDBDoc,
  );

  const contentShareDBDocPresence = useShareDBDocPresence(
    info.id,
    'Content',
  );

  const ownerUser: User = useShareDBDocData(
    ownerUserSnapshot,
    'User',
  );
  const forkedFromInfo: Info = useShareDBDocData(
    forkedFromInfoSnapshot,
    'Info',
  );
  const forkedFromOwnerUser: User = useShareDBDocData<User>(
    forkedFromOwnerUserSnapshot,
    'User',
  );

  // ///////////////////////////////////////////////////
  /////////////// Modals & Toggles /////////////////////
  // ///////////////////////////////////////////////////

  const [showForkModal, toggleForkModal] = useToggleState();
  const [showSettingsModal, toggleSettingsModal] =
    useToggleState();
  const [showShareModal, toggleShareModal] =
    useToggleState();
  const [
    showDeleteVizConfirmationModal,
    toggleDeleteVizConfirmationModal,
  ] = useToggleState();
  const [
    showAIAssistUpgradeNudgeModal,
    toggleAIAssistUpgradeNudgeModal,
  ] = useToggleState();
  const [
    showExportCodeUpgradeNudgeModal,
    toggleExportCodeUpgradeNudgeModal,
  ] = useToggleState();

  const [showRevisionHistory, toggleShowRevisionHistory] =
    useToggleState(false);

  const [showEditWithAIModal, toggleEditWithAIModal] =
    useToggleState(false);
  ////////////////////////////////////////////////////
  /////////////// Revision History ///////////////////
  ////////////////////////////////////////////////////

  const { revisionHistory, restoreToRevision } =
    useRevisionHistory({
      showRevisionHistory,
      vizKit,
      id: info.id,
    });

  ///////////////////////////////////////////
  /////////////// Forking ///////////////////
  ///////////////////////////////////////////

  // When the user clicks the link (not button) to fork the viz
  // in the toast that appears when the user has unsaved edits.
  const handleForkLinkClick = useCallback(
    (
      event: React.MouseEvent<
        HTMLAnchorElement,
        MouseEvent
      >,
    ) => {
      // Needed because the link is an anchor tag.
      event.preventDefault();
      toggleForkModal();
    },
    [toggleForkModal],
  );

  // Get ShareDB errors from middleware.
  // This checks for things like:
  // - Access Denied
  // - Viz Too Large
  const {
    shareDBError,
    dismissShareDBError,
    setShareDBError,
  } = useShareDBError();

  // When the user clicks "Fork" from within the fork modal
  // or from the fork link in the toast.
  const onFork = useOnFork({
    vizKit,
    id: info.id,
    content,
    setShareDBError,
    toggleForkModal,
  });

  const {
    onEditWithAI,
    isEditingWithAI,
    modelName,
    setModelName,
    modelNameOptions,
  } = useOnEditWithAI({
    vizKit,
    id: info.id,
    contentShareDBDoc,
  });

  ////////////////////////////////////////////
  /////////////// Settings ///////////////////
  ////////////////////////////////////////////

  // When the user clicks "Save" from within the settings modal.
  const onSettingsSave = useOnSettingsSave({
    submitInfoOperation,
    submitContentOperation,
    toggleSettingsModal,
  });

  // /////////////////////////////////////////
  ////////////// URL State ///////////////////
  // /////////////////////////////////////////

  const {
    isEmbedMode,
    isEmbedBrandedURLParam,
    isHideMode,
    showEditor,
    isFileOpen,
    setShowEditor,
  } = useURLState();

  // Navigates the user to the new URL when the slug is changed.
  useSlugAutoNavigate({ info, isEmbedMode });

  // Saves the title when the user edits it.
  const setVizTitle = useSetVizTitle(submitInfoOperation);

  const setAnyoneCanEdit = useSetAnyoneCanEdit(
    submitInfoOperation,
  );

  const setUncommitted = useSetUncommitted(
    submitInfoOperation,
  );

  ///////////////////////////////////////////
  /////////////// Analytics//////////////////
  ///////////////////////////////////////////

  // Send an analytics event to track this page view.
  useEffect(() => {
    vizKit.rest.recordAnalyticsEvents(
      `event.pageview.viz.owner:${ownerUser.id}.viz:${info.id}`,
    );
  }, []);

  ///////////////////////////////////////////
  /////////////// Upvoting //////////////////
  ///////////////////////////////////////////

  const { isUpvoted, handleUpvoteClick } = useUpvoting({
    initialIsUpvoted,
    vizKit,
    id: info.id,
  });

  const runtimeVersion = useMemo(
    () =>
      determineRuntimeVersion(
        vizFilesToFileCollection(content?.files),
      ),
    [content?.files],
  );

  const exportHref = useMemo(
    () =>
      getVizExportHref({
        ownerUser,
        info,
        runtimeVersion,
      }),
    [ownerUser, info],
  );

  const contextValue: VizPageContextValue = {
    info,
    ownerUser,
    initialReadmeHTML,
    forkedFromInfo,
    forkedFromOwnerUser,
    initialSrcdoc,
    initialSrcdocError,
    canUserEditViz,
    canUserDeleteViz,
    vizCacheContents,
    initialCollaborators,
    slugResolutionCache,
    initialComments,
    initialCommentAuthors,
    connected,
    content,
    contentShareDBDoc,
    contentShareDBDocPresence,
    showForkModal,
    toggleForkModal,
    showSettingsModal,
    toggleSettingsModal,
    showShareModal,
    toggleShareModal,
    onSettingsSave,
    onFork,
    setAnyoneCanEdit,
    showDeleteVizConfirmationModal,
    toggleDeleteVizConfirmationModal,
    showAIAssistUpgradeNudgeModal,
    toggleAIAssistUpgradeNudgeModal,
    showExportCodeUpgradeNudgeModal,
    toggleExportCodeUpgradeNudgeModal,
    showEditor,
    setShowEditor,
    isEmbedMode,
    isEmbedBrandedURLParam,
    isHideMode,
    isFileOpen,
    setVizTitle,
    submitContentOperation,
    exportHref,
    handleForkLinkClick,
    shareDBError,
    setShareDBError,
    dismissShareDBError,
    isUpvoted,
    handleUpvoteClick,
    vizKit,
    setUncommitted,
    showRevisionHistory,
    toggleShowRevisionHistory,
    revisionHistory,
    restoreToRevision,
    commitMetadata,
    runtimeVersion,
    toggleEditWithAIModal,
    showEditWithAIModal,
    onEditWithAI,
    isEditingWithAI,
    modelName,
    setModelName,
    modelNameOptions,
  };

  return (
    <VizPageContext.Provider value={contextValue}>
      {children}
    </VizPageContext.Provider>
  );
};

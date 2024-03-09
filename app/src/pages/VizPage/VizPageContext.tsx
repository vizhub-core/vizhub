import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { VizPageData } from './VizPageData';
import { VizKitAPI } from 'api/src/VizKit';
import { useShareDBConnectionStatus } from '../../useShareDBConnectionStatus';
import { ShareDBDoc, useSubmitOperation } from 'vzcode';
import {
  Comment,
  Content,
  Info,
  PREMIUM,
  SlugKey,
  Snapshot,
  User,
  UserId,
  Visibility,
  VizId,
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

export type VizPageContextValue = {
  info: Info;
  content: Content;
  contentShareDBDoc: ShareDBDoc<Content>;
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
  }: {
    owner: UserId;
    title: string;
    visibility: Visibility;
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
    ownerUserSnapshot,
    initialReadmeHTML,
    forkedFromInfoSnapshot,
    forkedFromOwnerUserSnapshot,
    initialSrcdoc,
    initialSrcdocError,
    canUserEditViz,
    canUserDeleteViz,
    vizCacheContentSnapshots,
    initialCollaborators,
    initialIsUpvoted,
    slugResolutionCache,
    initialComments,
    initialCommentAuthors,
  } = pageData;

  // /////////////////////////////////////////
  /////////////// ShareDB ////////////////////
  // /////////////////////////////////////////
  const { connected } = useShareDBConnectionStatus();
  const infoShareDBDoc: ShareDBDoc<Info> =
    useShareDBDoc<Info>(infoSnapshot, 'Info');
  const info: Info = useData(infoSnapshot, infoShareDBDoc);
  const submitInfoOperation =
    useSubmitOperation<Info>(infoShareDBDoc);

  const vizCacheShareDBDocs = useShareDBDocs(
    vizCacheContentSnapshots,
    'Content',
  );
  const vizCacheContents: Record<string, Content> =
    useDataRecord(
      vizCacheContentSnapshots,
      vizCacheShareDBDocs,
    );

  const contentShareDBDoc: ShareDBDoc<Content> =
    vizCacheShareDBDocs[info.id];
  const content: Content = vizCacheContents[info.id];

  const submitContentOperation: (
    next: (content: Content) => Content,
  ) => void = useSubmitOperation<Content>(
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

  // /////////////////////////////////////////
  /////////////// Modals /////////////////////
  // /////////////////////////////////////////

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

  // When the user clicks "Fork" from within the fork modal.
  const onFork = useOnFork({
    vizKit,
    id: info.id,
    content,
    setShareDBError,
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

  const exportHref = useMemo(
    () =>
      getVizExportHref({
        ownerUser,
        info,
      }),
    [ownerUser, info],
  );

  // const authenticatedUser: User = useContext(
  //   AuthenticatedUserContext,
  // );

  // const handleExportCodeClick = useCallback(() => {
  //   vizKit.rest.recordAnalyticsEvents(
  //     `event.click.export-code.viz.owner:${ownerUser.id}.viz:${info.id}`,
  //   );
  //   if (authenticatedUser?.plan === PREMIUM) {
  //     // Trigger a download of the .zip file.
  //     const exportHref = getVizExportHref({
  //       ownerUser,
  //       info,
  //     });
  //     // Simulate the user clicking on a link
  //     // that will download the file.
  //     const link = document.createElement('a');
  //     link.setAttribute('href', exportHref);
  //     link.setAttribute('download', info.title);
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   } else {
  //     toggleExportCodeUpgradeNudgeModal();
  //   }
  // }, [authenticatedUser, ownerUser, info]);

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
  };

  return (
    <VizPageContext.Provider value={contextValue}>
      {children}
    </VizPageContext.Provider>
  );
};

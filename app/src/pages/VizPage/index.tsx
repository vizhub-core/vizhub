import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Files,
  ShareDBDoc,
  SplitPaneResizeProvider,
  useSubmitOperation,
} from 'vzcode';
import {
  getRuntimeVersion,
  Content,
  Info,
  Snapshot,
  User,
  VizId,
  SlugKey,
} from 'entities';
import { VizKit } from 'api/src/VizKit';
import {
  useData,
  useDataRecord,
  useShareDBDoc,
  useShareDBDocData,
  useShareDBDocPresence,
  useShareDBDocs,
} from '../../useShareDBDocData';
import { AuthenticatedUserProvider } from '../../contexts/AuthenticatedUserContext';
import { Page, PageData } from '../Page';
import { VizPageBody } from './VizPageBody';
import { VizPageToasts } from './VizPageToasts';
import { useOnFork } from './useOnFork';
import { generateExportZipV2 } from './export/generateExportZipV2';
import { generateExportZipV3 } from './export/generateExportZipV3';
import {
  useOnSettingsSave,
  useSetAnyoneCanEdit,
  useSetUncommitted,
  useSetVizTitle,
} from './useVizMutations';
import { useToggleState } from './useToggleState';
import { VizPageModals } from './VizPageModals';
import { useUpvoting } from './useUpvoting';
import { useSlugAutoNavigate } from './useSlugAutoNavigate';
import { useShareDBError } from './useShareDBError';
import './styles.scss';
import {
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

const vizKit = VizKit({ baseUrl: '/api' });

export type VizPageData = PageData & {
  infoSnapshot: Snapshot<Info>;
  ownerUserSnapshot: Snapshot<User>;
  forkedFromInfoSnapshot: Snapshot<Info> | null;
  forkedFromOwnerUserSnapshot: Snapshot<User> | null;
  authenticatedUserSnapshot: Snapshot<User> | null;
  initialReadmeHTML: string;
  initialSrcdoc: string;
  initialSrcdocError: string | null;
  canUserEditViz: boolean;
  canUserDeleteViz: boolean;
  vizCacheContentSnapshots: Record<
    VizId,
    Snapshot<Content>
  >;
  initialCollaborators: Array<User>;
  initialIsUpvoted: boolean;
  slugResolutionCache: Record<SlugKey, VizId>;
};

// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const VizPage: Page = ({
  pageData,
}: {
  pageData: VizPageData;
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
  } = pageData;

  // /////////////////////////////////////////
  /////////////// ShareDB ////////////////////
  // /////////////////////////////////////////
  const infoShareDBDoc: ShareDBDoc<Info> =
    useShareDBDoc<Info>(infoSnapshot, 'Info');
  const info: Info = useData(infoSnapshot, infoShareDBDoc);
  const id: VizId = info.id;
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
    vizCacheShareDBDocs[id];
  const content: Content = vizCacheContents[id];

  const submitContentOperation: (
    next: (content: Content) => Content,
  ) => void = useSubmitOperation<Content>(
    contentShareDBDoc,
  );

  const contentShareDBDocPresence = useShareDBDocPresence(
    id,
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

  // /////////////////////////////////////////
  /////////////// Callbacks //////////////////
  // /////////////////////////////////////////

  // Handle when the user clicks the "Export" button.
  const onExportClick = useCallback(() => {
    const currentFiles: Files = content.files;

    // Figure out which version we are in.
    const runtimeVersion: number =
      getRuntimeVersion(content);

    // Compute the file name based on the viz title.
    const fileName = `${info.title}.zip`;

    if (runtimeVersion === 2) {
      generateExportZipV2(currentFiles, fileName);
    } else if (runtimeVersion === 3) {
      generateExportZipV3(currentFiles, fileName);
    } else {
      throw new Error(
        `Unknown runtime version: ${runtimeVersion}`,
      );
    }
  }, []);

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
  const { shareDBError, dismissShareDBError } =
    useShareDBError();

  // const [hasUnforkedEdits, setHasUnforkedEdits] =
  //   useState<boolean>(false);

  // When the user clicks "Fork" from within the fork modal.
  const onFork = useOnFork({
    vizKit,
    id,
    content,
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

  // Embed mode - to make the viz full screen
  // ?mode=embed
  const [searchParams, setSearchParams] = useSearchParams();

  const isEmbedMode = useMemo(
    () => searchParams.get('mode') === 'embed',
    [searchParams],
  );

  // Is the viz embed branded parameter set?
  // ?embed=branded
  const isEmbedBrandedURLParam = useMemo(
    () => searchParams.get('embed') === 'branded',
    [searchParams],
  );

  // Hide mode - to hide the viewer and only show the editor
  // ?mode=hide
  const isHideMode = useMemo(
    () => searchParams.get('mode') === 'hide',
    [searchParams],
  );

  // `showEditor`
  // True if the sidebar should be shown.
  // ?edit=files
  const showEditor = useMemo(
    () => searchParams.has('edit'),
    [searchParams],
  );

  // `isFileOpen`
  // True if a file is open.
  // ?file=filename
  const isFileOpen = useMemo(
    () => searchParams.has('file'),
    [searchParams],
  );

  // useEffect(() => {
  //   console.log(
  //     'current search params: ',
  //     searchParams.toString(),
  //   );
  // }, [searchParams]);

  // const setShowEditor = useCallback(
  //   (next: boolean) => {
  //     const updatedSearchParams = new URLSearchParams(
  //       searchParams,
  //     );
  //     if (next) {
  //       updatedSearchParams.set('edit', 'files');
  //     } else {
  //       updatedSearchParams.delete('edit');
  //     }
  //     setSearchParams(updatedSearchParams);
  //   },
  //   [searchParams, setSearchParams],
  // );

  const setShowEditor = useCallback(
    (next: boolean) => {
      setSearchParams(
        (oldSearchParams: URLSearchParams) => {
          const updatedSearchParams = new URLSearchParams(
            oldSearchParams,
          );
          if (next) {
            updatedSearchParams.set('edit', 'files');
          } else {
            updatedSearchParams.delete('edit');
          }
          return updatedSearchParams;
        },
      );
    },
    [setSearchParams],
  );

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
    id,
  });

  return (
    <AuthenticatedUserProvider
      authenticatedUserSnapshot={
        pageData.authenticatedUserSnapshot
      }
    >
      <SplitPaneResizeProvider>
        <VizPageBody
          {...{
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
            initialIsUpvoted,
            isUpvoted,
            handleUpvoteClick,
            slugResolutionCache,
            isEmbedMode,
            isEmbedBrandedURLParam,
            isHideMode,
            toggleAIAssistUpgradeNudgeModal,
            isFileOpen,
          }}
        />
      </SplitPaneResizeProvider>
      <VizPageToasts
        shareDBError={shareDBError}
        dismissShareDBError={dismissShareDBError}
        handleForkLinkClick={handleForkLinkClick}
      />
      <VizPageModals
        {...{
          info,
          content,
          ownerUser,
          showForkModal,
          toggleForkModal,
          onFork,
          showSettingsModal,
          toggleSettingsModal,
          showShareModal,
          toggleShareModal,
          onSettingsSave,
          setAnyoneCanEdit,
          showDeleteVizConfirmationModal,
          toggleDeleteVizConfirmationModal,
          vizKit,
          initialCollaborators,
          showAIAssistUpgradeNudgeModal,
          toggleAIAssistUpgradeNudgeModal,
        }}
      />
    </AuthenticatedUserProvider>
  );
};

VizPage.path = '/:userName/:idOrSlug';

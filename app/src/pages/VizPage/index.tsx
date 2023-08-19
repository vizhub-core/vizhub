import { useCallback, useEffect, useState } from 'react';
import {
  Content,
  FileId,
  Info,
  Snapshot,
  User,
  VizId,
} from 'entities';
import { VizKit } from 'api/src/VizKit';
import {
  getConnection,
  useData,
  useShareDBDoc,
  useShareDBDocData,
  useShareDBDocPresence,
} from '../../useShareDBDocData';
import { AuthenticatedUserProvider } from '../../contexts/AuthenticatedUserContext';
import { Page, PageData } from '../Page';
import { VizPageBody } from './VizPageBody';
import './styles.scss';
import { VizPageToasts } from './VizPageToasts';
import { useOnFork } from './useOnFork';
import { useOnSave } from './useOnSave';
import { useOnSettingsSave } from './useOnSettingsSave';

const vizKit = VizKit({ baseUrl: '/api' });

export type VizPageData = PageData & {
  infoSnapshot: Snapshot<Info>;
  contentSnapshot: Snapshot<Content>;
  ownerUserSnapshot: Snapshot<User>;
  forkedFromInfoSnapshot: Snapshot<Info> | null;
  forkedFromOwnerUserSnapshot: Snapshot<User> | null;
  authenticatedUserSnapshot: Snapshot<User> | null;
  initialReadmeHTML: string;
  initialSrcdoc: string;
  canUserEditViz: boolean;
};

// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const VizPage: Page = ({
  pageData,
}: {
  pageData: VizPageData;
}) => {
  const {
    infoSnapshot,
    contentSnapshot,
    ownerUserSnapshot,
    initialReadmeHTML,
    forkedFromInfoSnapshot,
    forkedFromOwnerUserSnapshot,
    initialSrcdoc,
    canUserEditViz,
  } = pageData;
  const info: Info = useShareDBDocData(
    infoSnapshot,
    'Info',
  );
  const id: VizId = info.id;

  const contentShareDBDoc = useShareDBDoc<Content>(
    contentSnapshot,
    'Content',
  );
  const content: Content = useData(
    contentSnapshot,
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

  // `showEditor`
  // True if the sidebar should be shown.
  const [showEditor, setShowEditor] = useState(false);

  // `activeFileId`
  // The id of the currently open file tab.
  const [activeFileId, setActiveFileId] =
    useState<FileId | null>(null);

  // `tabList`
  // The ordered list of tabs in the code editor.
  const [tabList, setTabList] = useState<Array<FileId>>([]);

  const onExportClick = useCallback(() => {
    console.log('TODO onExportClick');
  }, []);

  const onShareClick = useCallback(() => {
    console.log('TODO onShareClick');
  }, []);

  // State of whether or not the fork modal is open.
  const [showForkModal, setShowForkModal] = useState(false);

  // When the user clicks the "Fork" icon to open the fork modal.
  // When the user hits the "x" to close the modal.
  const toggleForkModal = useCallback(() => {
    setShowForkModal((showForkModal) => !showForkModal);
  }, []);

  // State of whether or not the settings modal is open.
  const [showSettingsModal, setShowSettingsModal] =
    useState(false);

  // When the user clicks the "Settings" icon to open the settings modal.
  // When the user hits the "x" to close the modal.
  const toggleSettingsModal = useCallback(() => {
    setShowSettingsModal(
      (showSettingsModal) => !showSettingsModal,
    );
  }, []);

  // When the user clicks the link (not button) to fork the viz
  // in the toast that appears when the user has unsaved edits.
  const handleForkLinkClick = useCallback(
    (
      event: React.MouseEvent<
        HTMLAnchorElement,
        MouseEvent
      >,
    ) => {
      event.preventDefault();
      toggleForkModal();
    },
    [toggleForkModal],
  );

  // Show ShareDB errors as toast
  const [hasUnforkedEdits, setHasUnforkedEdits] =
    useState<boolean>(false);
  // const hideToast = useCallback(() => {
  //   setToastMessage(null);
  // }, []);

  // When the user clicks "Fork" from within the fork modal.
  const onFork = useOnFork({
    vizKit,
    id,
    content,
    hasUnforkedEdits,
  });

  // When the user clicks "Save" from within the settings modal.
  const onSettingsSave = useOnSettingsSave();

  // Send an analytics event to track this page view.
  useEffect(() => {
    vizKit.rest.recordAnalyticsEvents(
      `event.pageview.viz.owner:${ownerUser.id}.viz:${info.id}`,
    );
  }, []);

  // Handle permissions errors
  useEffect(() => {
    const connection = getConnection();
    const handleError = (error) => {
      // TODO check that the error is related to access permissions
      // This has no information - console.log('error.code', error.code);
      // Don't want to test against exact message? Or we could if it's a variable?
      // Best solution is to add a custom error code to the server
      console.log('error.message', error.message);

      setHasUnforkedEdits(true);

      // Also allow the user to make edits without forking.
      // Their edits are not synched to the server, but are kept in memory.
      // The edited version will be saved if the user does fork.
      connection.close();
    };

    connection.on('error', handleError);
    return () => {
      connection.off('error', handleError);
    };
  }, []);

  return (
    <AuthenticatedUserProvider
      authenticatedUserSnapshot={
        pageData.authenticatedUserSnapshot
      }
    >
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
          activeFileId,
          setActiveFileId,
          tabList,
          setTabList,

          onExportClick,
          onShareClick,
          showForkModal,
          toggleForkModal,
          onFork,
          initialReadmeHTML,

          showSettingsModal,
          toggleSettingsModal,
          onSettingsSave,

          initialSrcdoc,
          canUserEditViz,
        }}
      />
      <VizPageToasts
        hasUnforkedEdits={hasUnforkedEdits}
        handleForkLinkClick={handleForkLinkClick}
      />
    </AuthenticatedUserProvider>
  );
};

VizPage.path = '/:userName/:id';

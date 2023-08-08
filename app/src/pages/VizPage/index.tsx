import { useCallback, useEffect, useState } from 'react';
import { Content, FileId, Info, Snapshot, User, VizId } from 'entities';
import { VizKit } from 'api/src/VizKit';
import { VizToast } from 'components/src/components/VizToast';
import { VizPageBody } from './VizPageBody';
import { Page, PageData } from '../Page';
import {
  getConnection,
  useData,
  useShareDBDoc,
  useShareDBDocData,
  useShareDBDocPresence,
} from '../../useShareDBDocData';
import { AuthenticatedUserProvider } from '../../contexts/AuthenticatedUserContext';
import './styles.scss';

const vizKit = VizKit({ baseUrl: '/api' });

export type VizPageData = PageData & {
  infoSnapshot: Snapshot<Info>;
  contentSnapshot: Snapshot<Content>;
  ownerUserSnapshot: Snapshot<User>;
  forkedFromInfoSnapshot: Snapshot<Info> | null;
  forkedFromOwnerUserSnapshot: Snapshot<User> | null;
  authenticatedUserSnapshot: Snapshot<User> | null;
  initialReadmeHTML: string;
  srcdoc: string;
};

// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const VizPage: Page = ({ pageData }: { pageData: VizPageData }) => {
  const {
    infoSnapshot,
    contentSnapshot,
    ownerUserSnapshot,
    initialReadmeHTML,
    forkedFromInfoSnapshot,
    forkedFromOwnerUserSnapshot,
    srcdoc,
  } = pageData;
  const info: Info = useShareDBDocData(infoSnapshot, 'Info');
  const id: VizId = info.id;

  const contentShareDBDoc = useShareDBDoc<Content>(contentSnapshot, 'Content');
  const content: Content = useData(contentSnapshot, contentShareDBDoc);

  const contentShareDBDocPresence = useShareDBDocPresence(id, 'Content');

  const ownerUser: User = useShareDBDocData(ownerUserSnapshot, 'User');
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
  const [activeFileId, setActiveFileId] = useState<FileId | null>(null);

  // `tabList`
  // The ordered list of tabs in the code editor.
  const [tabList, setTabList] = useState<Array<FileId>>([]);

  const [showForkModal, setShowForkModal] = useState(false);

  const onExportClick = useCallback(() => {
    console.log('TODO onExportClick');
  }, []);

  const onShareClick = useCallback(() => {
    console.log('TODO onShareClick');
  }, []);

  // When the user clicks the "Fork" icon to open the fork modal.
  // When the user hits the "x" to close the modal.
  const toggleForkModal = useCallback((event) => {
    event?.preventDefault();
    setShowForkModal((showForkModal) => !showForkModal);
  }, []);

  // When the user clicks "Fork" from within the fork modal.
  const onFork = useCallback(() => {
    console.log('TODO onFork - fork the viz, navigate, show toast');
  }, []);

  // Send an analytics event to track this page view.
  useEffect(() => {
    vizKit.rest.recordAnalyticsEvents(
      `event.pageview.viz.owner:${ownerUser.id}.viz:${info.id}`,
    );
  }, []);

  // Show ShareDB errors as toast
  const [showToast, setShowToast] = useState<boolean>(false);
  // const hideToast = useCallback(() => {
  //   setToastMessage(null);
  // }, []);

  // Handle permissions errors
  useEffect(() => {
    const connection = getConnection();
    const handleError = (error) => {
      setShowToast(true);

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
      authenticatedUserSnapshot={pageData.authenticatedUserSnapshot}
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

          srcdoc,
        }}
      />
      {showToast ? (
        <VizToast title="Limited Editing Permissions">
          <ul className="mb-0">
            <li>You do not have permissions to edit this viz</li>
            <li>Local edits are possible but won't be saved</li>
            <li>Disconnected from remote updates</li>
            <li>
              <a href="" onClick={toggleForkModal}>
                Fork the viz
              </a>{' '}
              to save your local changes
            </li>
          </ul>
        </VizToast>
      ) : null}
    </AuthenticatedUserProvider>
  );
};

VizPage.path = '/:userName/:id';

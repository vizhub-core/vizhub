import { useCallback, useEffect, useState } from 'react';
import {
  Content,
  FileId,
  Info,
  Snapshot,
  User,
  UserId,
  Visibility,
  VizId,
} from 'entities';
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
import { Result } from 'gateways';

const vizKit = VizKit({ baseUrl: '/api' });

// Useful for debugging fork flow.
const debug = false;

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
  const toggleForkModal = useCallback(() => {
    setShowForkModal((showForkModal) => !showForkModal);
  }, []);

  const handleForkLinkClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      event.preventDefault();
      toggleForkModal();
    },
    [toggleForkModal],
  );

  // Show ShareDB errors as toast
  const [hasUnforkedEdits, setHasUnforkedEdits] = useState<boolean>(false);
  // const hideToast = useCallback(() => {
  //   setToastMessage(null);
  // }, []);

  // When the user clicks "Fork" from within the fork modal.
  const onFork = useCallback(
    ({
      owner,
      title,
      visibility,
    }: {
      // These values come from the fork modal
      owner: UserId;
      title: string;
      visibility: Visibility;
    }) => {
      if (debug) {
        console.log(
          'Passing these into forkViz',
          JSON.stringify(
            {
              forkedFrom: id,
              owner,
              title,
              visibility,
              content: hasUnforkedEdits ? content : undefined,
            },
            null,
            2,
          ),
        );
      }
      vizKit.rest
        .forkViz({
          forkedFrom: id,
          owner,
          title,
          visibility,
          content: hasUnforkedEdits ? content : undefined,
        })
        .then((result: Result<{ vizId: VizId; ownerUserName: string }>) => {
          if (result.outcome === 'failure') {
            console.log('TODO handle failure to fork');
            console.log(result.error);
            return;
          }
          const { vizId, ownerUserName } = result.value;
          const url = `/${ownerUserName}/${vizId}`;

          // TODO populate cookie to show toast on the other side
          // TODO show toast on the other side

          window.location.href = url;
        });
    },
    [id, content, hasUnforkedEdits],
  );

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
      // Don't want to test against exact message
      // Best solution is to add a custom error code to the server

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
      {hasUnforkedEdits ? (
        <VizToast title="Limited Editing Permissions">
          <ul className="mb-0">
            <li>You do not have permissions to edit this viz</li>
            <li>Local edits are possible but won't be saved</li>
            <li>Disconnected from remote updates</li>
            <li>
              <a href="" onClick={handleForkLinkClick}>
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

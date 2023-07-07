import { useCallback, useEffect, useState } from 'react';
import { Content, Info, Snapshot, User } from 'entities';
import { VizKit } from 'api/src/VizKit';
import { useShareDBDocData } from '../../useShareDBDocData';
import { AuthenticatedUserProvider } from '../../contexts/AuthenticatedUserContext';
import { VizPageBody } from './VizPageBody';
import { Page, PageData } from '../Page';
import './styles.css';

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
  } = pageData;
  const info: Info = useShareDBDocData(infoSnapshot, 'Info');
  const content: Content = useShareDBDocData(contentSnapshot, 'Content');
  const ownerUser: User = useShareDBDocData(ownerUserSnapshot, 'User');
  const forkedFromInfo: Info = useShareDBDocData(
    forkedFromInfoSnapshot,
    'Info'
  );
  const forkedFromOwnerUser: User = useShareDBDocData(
    forkedFromOwnerUserSnapshot,
    'User'
  );

  // TODO move this to URL
  // https://github.com/vizhub-core/vizhub3/issues/107
  // ?edit=files
  const [showEditor, setShowEditor] = useState(false);
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

  // When the user clicks "Fork" from within the fork modal.
  const onFork = useCallback(() => {
    console.log('TODO onFork - fork the viz, navigate, show toast');
  }, []);

  // Send an analytics event to track this page view.
  useEffect(() => {
    vizKit.rest.recordAnalyticsEvents(
      `event.pageview.viz.owner:${ownerUser.id}.viz:${info.id}`
    );
  }, []);

  return (
    <AuthenticatedUserProvider
      authenticatedUserSnapshot={pageData.authenticatedUserSnapshot}
    >
      <VizPageBody
        {...{
          // Entities
          info,
          content,
          ownerUser,
          forkedFromInfo,
          forkedFromOwnerUser,

          // UI state
          showEditor,
          setShowEditor,
          onExportClick,
          onShareClick,
          showForkModal,
          toggleForkModal,
          onFork,
          initialReadmeHTML,

          // Runtime state
          srcdoc,
        }}
      />
    </AuthenticatedUserProvider>
  );
};

VizPage.path = '/:userName/:id';

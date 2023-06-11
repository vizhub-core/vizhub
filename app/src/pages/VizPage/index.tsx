import { useCallback, useState } from 'react';
import { Info, User } from 'entities';
import { useShareDBDocData } from '../../useShareDBDocData';
import { AuthenticatedUserProvider } from '../../contexts/AuthenticatedUserContext';
import { VizPageBody } from './VizPageBody';

// Display `user.displayName` if it's populated.
// Otherwise fall back to `user.userName`.
const getUserDisplayName = (user) => user.displayName || user.userName;

// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const VizPage = ({ pageData }) => {
  const { infoSnapshot, ownerUserSnapshot } = pageData;
  const info: Info = useShareDBDocData(infoSnapshot, 'Info');
  const ownerUser: User = useShareDBDocData(ownerUserSnapshot, 'User');

  // TODO move this to URL
  // ?edit=files
  const [showEditor, setShowEditor] = useState(false);
  const [showForkModal, setShowForkModal] = useState(false);

  console.log('TODO present this stuff:');
  console.log(JSON.stringify({ info, ownerUser }, null, 2));
  console.log('title', info.title);
  console.log('author', getUserDisplayName(ownerUser));

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
  // TODO match how vizHub2 does it, so we can use that existing data
  // useEffect(() => {
  //   vizKit.rest.recordAnalyticsEvents('pageview.viz.' + info.id);
  // }, []);

  return (
    <AuthenticatedUserProvider
      authenticatedUserSnapshot={pageData.authenticatedUserSnapshot}
    >
      <VizPageBody
        {...{
          showEditor,
          setShowEditor,
          onExportClick,
          onShareClick,
          showForkModal,
          toggleForkModal,
          info,
          onFork,
        }}
      />
    </AuthenticatedUserProvider>
  );
};

VizPage.path = '/:userName/:id';

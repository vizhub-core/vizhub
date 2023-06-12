import { useCallback, useState } from 'react';
import { Content, Info, User } from 'entities';
import { useShareDBDocData } from '../../useShareDBDocData';
import { AuthenticatedUserProvider } from '../../contexts/AuthenticatedUserContext';
import { VizPageBody } from './VizPageBody';
import { getUserDisplayName } from '../../accessors/getUserDisplayName';

// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const VizPage = ({ pageData }) => {
  const {
    infoSnapshot,
    contentSnapshot,
    ownerUserSnapshot,
    initialReadmeHTML,
  } = pageData;
  const info: Info = useShareDBDocData(infoSnapshot, 'Info');
  const content: Content = useShareDBDocData(contentSnapshot, 'Content');
  const ownerUser: User = useShareDBDocData(ownerUserSnapshot, 'User');

  console.log(
    'TODO display owner user details in Viz PAge:',
    getUserDisplayName(ownerUser)
  );

  console.log(
    'TODO pass content with files into depths of Viz page:',
    JSON.stringify(content, null, 2)
  );

  // TODO move this to URL
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
          initialReadmeHTML,
        }}
      />
    </AuthenticatedUserProvider>
  );
};

VizPage.path = '/:userName/:id';

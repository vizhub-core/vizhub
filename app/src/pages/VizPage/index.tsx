import { useCallback, useState } from 'react';
import { Info, User } from 'entities';
import { useShareDBDocData } from '../../useShareDBDocData';
import { VizPageHead, Header, ForkModal } from 'components';

// Display `user.displayName` if it's populated.
// Otherwise fall back to `user.userName`.
const getUserDisplayName = (user) => user.displayName || user.userName;

// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const VizPage = ({ pageData }) => {
  const { infoSnapshot, ownerUserSnapshot, authenticatedUserSnapshot } =
    pageData;

  // TODO move this to URL
  // ?edit=files
  const [showEditor, setShowEditor] = useState(false);
  const [showForkModal, setShowForkModal] = useState(false);

  const info: Info = useShareDBDocData(infoSnapshot, 'Info');
  const ownerUser: User = useShareDBDocData(ownerUserSnapshot, 'User');
  const authenticatedUser: User = useShareDBDocData(
    authenticatedUserSnapshot,
    'User'
  );

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

  // The list of possible owners of a fork of this viz.
  const possibleOwners = [
    // TODO label: getUserDisplayName(authenticatedUser)
    //   where authenticatedUser = pageData.authenticatedUser,
    //   fetched from User collection of VizHub DB
    { id: authenticatedUser.id, label: getUserDisplayName(authenticatedUser) },
  ];

  return (
    <div className="vh-page overflow-auto">
      <Header
        loginHref={'/login'}
        logoutHref={'/logout'}
        profileHref={`/${authenticatedUser.userName}`}
        authenticatedUserAvatarURL={authenticatedUser.picture}
      ></Header>
      <VizPageHead
        showEditor={showEditor}
        setShowEditor={setShowEditor}
        onExportClick={onExportClick}
        onShareClick={onShareClick}
        onForkClick={toggleForkModal}
      />
      <ForkModal
        initialTitle={'Fork of ' + info.title}
        initialVisibility={info.visibility}
        initialOwner={authenticatedUserId}
        possibleOwners={possibleOwners}
        show={showForkModal}
        onClose={toggleForkModal}
        onFork={onFork}
      />
    </div>
  );
};

VizPage.path = '/:userName/:id';

import { useContext } from 'react';
import { AuthenticatedUserContext } from '../../contexts/AuthenticatedUserContext';
import { Header } from '../../smartComponents/Header';
import { VizPageHead, ForkModal } from 'components';

export const VizPageBody = () => {
  const authenticatedUser = useContext(AuthenticatedUserContext);
  // The list of possible owners of a fork of this viz.
  const possibleOwners = [
    // TODO label: getUserDisplayName(authenticatedUser)
    //   where authenticatedUser = pageData.authenticatedUser,
    //   fetched from User collection of VizHub DB
    { id: authenticatedUser.id, label: getUserDisplayName(authenticatedUser) },
  ];
  return (
    <div className="vh-page overflow-auto">
      <Header />
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

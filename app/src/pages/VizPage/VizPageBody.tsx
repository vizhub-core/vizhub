import { useContext, useMemo } from 'react';
import { VizPageHead, ForkModal } from 'components';
import { AuthenticatedUserContext } from '../../contexts/AuthenticatedUserContext';
import { Header } from '../../smartComponents/Header';
import { getUserDisplayName } from '../../presenters/getUserDisplayName';
import { User } from 'entities';

export const VizPageBody = ({
  showEditor,
  setShowEditor,
  onExportClick,
  onShareClick,
  showForkModal,
  toggleForkModal,
  info,
  onFork,
}) => {
  const authenticatedUser: User | null = useContext(AuthenticatedUserContext);

  // The list of possible owners of a fork of this viz.
  const possibleForkOwners = useMemo(
    () =>
      authenticatedUser
        ? [
            {
              id: authenticatedUser.id,
              label: getUserDisplayName(authenticatedUser),
            },
          ]
        : [],
    [authenticatedUser]
  );

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
        initialOwner={authenticatedUser?.id}
        possibleOwners={possibleForkOwners}
        show={showForkModal}
        onClose={toggleForkModal}
        onFork={onFork}
      />
    </div>
  );
};

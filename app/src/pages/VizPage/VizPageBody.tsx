import { useContext, useMemo } from 'react';
import { VizPageHead, ForkModal, VizPageViewer } from 'components';
import { AuthenticatedUserContext } from '../../contexts/AuthenticatedUserContext';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import { getUserDisplayName } from '../../presenters/getUserDisplayName';
import { User } from 'entities';
import { renderVizRunner } from './renderVizRunner';
import { renderMarkdownHTML } from './renderMarkdownHTML';

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
      <SmartHeader />
      <VizPageHead
        showEditor={showEditor}
        setShowEditor={setShowEditor}
        onExportClick={onExportClick}
        onShareClick={onShareClick}
        onForkClick={toggleForkModal}
      />
      <VizPageViewer
        vizTitle={info.title}
        vizHeight={info.height}
        renderVizRunner={renderVizRunner}
        renderMarkdownHTML={renderMarkdownHTML}
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

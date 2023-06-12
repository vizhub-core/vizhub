import { useContext, useMemo } from 'react';
import { VizPageHead, ForkModal, VizPageViewer } from 'components';
import { AuthenticatedUserContext } from '../../contexts/AuthenticatedUserContext';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import { getUserDisplayName } from '../../accessors/getUserDisplayName';
import { User } from 'entities';
import { renderVizRunner } from './renderVizRunner';
import { useRenderMarkdownHTML } from './useRenderMarkdownHTML';

export const VizPageBody = ({
  showEditor,
  setShowEditor,
  onExportClick,
  onShareClick,
  showForkModal,
  toggleForkModal,
  info,
  onFork,
  initialReadmeHTML,
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

  const renderMarkdownHTML = useRenderMarkdownHTML(initialReadmeHTML);
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

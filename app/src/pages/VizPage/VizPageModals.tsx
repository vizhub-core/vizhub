import {
  DeleteVizConfirmationModal,
  ForkModal,
  SettingsModal,
  ShareModal,
} from 'components';
import {
  Info,
  User,
  UserId,
  Visibility,
  getUserDisplayName,
} from 'entities';
import { VizSettings } from './useVizMutations';
import { useCallback, useContext, useMemo } from 'react';
import { AuthenticatedUserContext } from '../../contexts/AuthenticatedUserContext';
import { getVizPageHref } from '../../accessors';

export const VizPageModals = ({
  info,
  ownerUser,
  showForkModal,
  toggleForkModal,
  onFork,
  showSettingsModal,
  toggleSettingsModal,
  showShareModal,
  toggleShareModal,
  onSettingsSave,
  setAnyoneCanEdit,
  showDeleteVizConfirmationModal,
  toggleDeleteVizConfirmationModal,
  onDeleteViz,
}: {
  info: Info;
  ownerUser: User;
  showForkModal: boolean;
  toggleForkModal: () => void;
  onFork: ({
    owner,
    title,
    visibility,
  }: {
    owner: UserId;
    title: string;
    visibility: Visibility;
  }) => void;
  showSettingsModal: boolean;
  toggleSettingsModal: () => void;
  showShareModal: boolean;
  toggleShareModal: () => void;
  onSettingsSave: (vizSettings: VizSettings) => void;
  setAnyoneCanEdit: (anyoneCanEdit: boolean) => void;
  showDeleteVizConfirmationModal: boolean;
  toggleDeleteVizConfirmationModal: () => void;
  onDeleteViz: () => void;
}) => {
  // The currently authenticated user, if any.
  const authenticatedUser: User | null = useContext(
    AuthenticatedUserContext,
  );

  // The list of possible owners of a fork of this viz.
  // Also serves as the list of possible owners of a settings change.
  const possibleOwners: Array<{
    id: UserId;
    label: string;
  }> = useMemo(
    () =>
      authenticatedUser
        ? [
            {
              id: authenticatedUser.id,
              label: getUserDisplayName(authenticatedUser),
            },
            // TODO add orgs that the user is a member of.
          ]
        : [],
    [authenticatedUser],
  );

  const anyoneCanEdit = info.anyoneCanEdit;

  const linkToCopy = useMemo(
    () => getVizPageHref(ownerUser, info),
    [ownerUser, info],
  );

  const handleLinkCopy = useCallback(() => {
    // Check if the Clipboard API is available
    if (navigator.clipboard && linkToCopy) {
      // Copy the link to the clipboard
      navigator.clipboard
        .writeText(linkToCopy)
        .then(() => {
          // TODO: show a toast or tooltip
          console.log(
            'Link copied to clipboard successfully!',
          );
        })
        .catch((err) => {
          console.error('Failed to copy link: ', err);
        });
    } else {
      console.error(
        'Clipboard API not available or link is empty.',
      );
    }
  }, [linkToCopy]);

  return (
    <>
      {showForkModal && (
        <ForkModal
          initialTitle={'Fork of ' + info.title}
          initialVisibility={info.visibility}
          initialOwner={authenticatedUser?.id}
          possibleOwners={possibleOwners}
          show={showForkModal}
          onClose={toggleForkModal}
          onFork={onFork}
          currentPlan={authenticatedUser?.plan}
          pricingHref={'/pricing'}
        />
      )}
      {showSettingsModal && (
        <SettingsModal
          initialTitle={info.title}
          initialVisibility={info.visibility}
          initialOwner={info.owner}
          possibleOwners={possibleOwners}
          show={showSettingsModal}
          onClose={toggleSettingsModal}
          onSave={onSettingsSave}
          currentPlan={authenticatedUser?.plan}
          pricingHref={'/pricing'}
        />
      )}
      {showShareModal && (
        <ShareModal
          show={showShareModal}
          onClose={toggleShareModal}
          linkToCopy={linkToCopy}
          onLinkCopy={handleLinkCopy}
          anyoneCanEdit={anyoneCanEdit}
          setAnyoneCanEdit={setAnyoneCanEdit}
        />
      )}
      {showDeleteVizConfirmationModal && (
        <DeleteVizConfirmationModal
          show={showDeleteVizConfirmationModal}
          onClose={toggleDeleteVizConfirmationModal}
          onConfirm={onDeleteViz}
        />
      )}
    </>
  );
};

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
  getAnyoneCanEdit,
  getUserDisplayName,
} from 'entities';
import { VizSettings } from './useVizMutations';
import { useCallback, useContext, useMemo } from 'react';
import { AuthenticatedUserContext } from '../../contexts/AuthenticatedUserContext';
import { getVizPageHref } from '../../accessors';
import { VizKitAPI } from 'api/src/VizKit';
import { useOnTrashViz } from './useOnTrashViz';

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
  vizKit,
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
  vizKit: VizKitAPI;
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

  const anyoneCanEdit = useMemo(
    () => getAnyoneCanEdit(info),
    [info],
  );

  // Only show the option to allow anyone to edit
  // if the viz is public.
  const showAnyoneCanEdit = useMemo(
    () => info.visibility === 'public',
    [info.visibility],
  );

  const linkToCopy = useMemo(
    () => getVizPageHref(ownerUser, info, true),
    [ownerUser, info],
  );

  // Handle when the user confirms that they
  // want to delete the viz (put it in the trash).
  const onTrashViz = useOnTrashViz({
    vizKit,
    id: info.id,
    authenticatedUser,
  });

  const handleLinkCopy = useCallback(() => {
    // Check if the Clipboard API is available
    if (navigator.clipboard && linkToCopy) {
      // Copy the link to the clipboard
      navigator.clipboard
        .writeText(linkToCopy)
        // .then(() => {
        //   // TODO: show a toast or tooltip
        //   console.log(
        //     'Link copied to clipboard successfully!',
        //   );
        // })
        .catch((err) => {
          console.error('Failed to copy link: ', err);
        });
    } else {
      console.error(
        'Clipboard API not available or link is empty.',
      );
    }
  }, [linkToCopy]);

  const handleCollaboratorSearch = useCallback(
    async (query: string) => {
      const result =
        await vizKit.rest.getUsersForTypeahead(query);
      if (result.outcome === 'failure') {
        console.error(
          'Failed to search for collaborators: ',
          result.error,
        );
        return;
      }
      return result.value;
    },
    [],
  );

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
          showAnyoneCanEdit={showAnyoneCanEdit}
          handleCollaboratorSearch={
            handleCollaboratorSearch
          }
        />
      )}
      {showDeleteVizConfirmationModal && (
        <DeleteVizConfirmationModal
          show={showDeleteVizConfirmationModal}
          onClose={toggleDeleteVizConfirmationModal}
          onConfirm={onTrashViz}
        />
      )}
    </>
  );
};

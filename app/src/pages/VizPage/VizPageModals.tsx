import {
  AIAssistUpgradeNudgeModal,
  DeleteVizConfirmationModal,
  ExportCodeUpgradeNudgeModal,
  EditWithAIModal,
  ForkModal,
  SettingsModal,
  ShareModal,
  copyToClipboard,
} from 'components';
import {
  FREE,
  User,
  UserId,
  getAnyoneCanEdit,
  getUserDisplayName,
  iframeSnippet,
} from 'entities';
import {
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { AuthenticatedUserContext } from '../../contexts/AuthenticatedUserContext';
import { getVizPageHref } from 'entities/src/accessors';
import { useOnTrashViz } from './useOnTrashViz';
import { useValidateSlug } from './useValidateSlug';
import { VizPageContext } from './VizPageContext';
import { STARTING_CREDITS } from 'entities/src/Pricing';
import { getCreditBalance } from 'entities/src/accessors';

export const VizPageModals = () => {
  const {
    info,
    content,
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
    initialCollaborators,
    showAIAssistUpgradeNudgeModal,
    toggleAIAssistUpgradeNudgeModal,
    showExportCodeUpgradeNudgeModal,
    toggleExportCodeUpgradeNudgeModal,
    showEditWithAIModal,
    toggleEditWithAIModal,
    onEditWithAI,
    modelName,
    setModelName,
    modelNameOptions,
    modelNameOptionsFree,
    commitMetadata,
  } = useContext(VizPageContext);

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
    () =>
      getVizPageHref({
        ownerUser,
        info,
        absolute: true,
      }),
    [ownerUser, info],
  );

  // The current branded option for the embed snippet.
  const [brandedOption, setBrandedOption] =
    useState('branded');

  const embedSnippetToCopy = useMemo(
    () =>
      iframeSnippet({
        ownerUserName: ownerUser.userName,
        idOrSlug: info.slug || info.id,
        height: content.height,
        brandedOption,
      }),
    [ownerUser, info, content, brandedOption],
  );

  // Handle when the user confirms that they
  // want to delete the viz (put it in the trash).
  const onTrashViz = useOnTrashViz({
    vizKit,
    id: info.id,
    authenticatedUser,
  });

  const handleLinkCopy = useCallback(() => {
    copyToClipboard(linkToCopy);
  }, [linkToCopy]);

  const handleEmbedSnippetCopy = useCallback(() => {
    copyToClipboard(embedSnippetToCopy);
  }, [embedSnippetToCopy]);

  // Support typeahead for adding collaborators
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

  // Actually add a collaborator to the viz
  const handleCollaboratorAdd = useCallback(
    async (user: User) => {
      const result = await vizKit.rest.addCollaborator({
        vizId: info.id,
        userId: user.id,
      });
      if (result.outcome === 'failure') {
        console.error(
          'Failed to add collaborator: ',
          result.error,
        );
        return;
      }
      return result.value;
    },
    [info.id],
  );

  // Actually remove a collaborator from the viz
  const handleCollaboratorRemove = useCallback(
    async (userId: UserId) => {
      const result = await vizKit.rest.removeCollaborator({
        vizId: info.id,
        userId,
      });
      if (result.outcome === 'failure') {
        console.error(
          'Failed to remove collaborator: ',
          result.error,
        );
        return;
      }
      return result.value;
    },
    [info.id],
  );

  // A function to validate a slug for custom URLs.
  const validateSlug = useValidateSlug({
    vizKit,
    owner: info.owner,
  });

  return (
    <>
      {showForkModal && (
        <ForkModal
          initialTitle={'Fork of ' + info.title}
          initialVisibility={
            // If the authenticated user is on the free plan,
            // and trying to fork a private viz, then make the
            // forked viz public.
            authenticatedUser?.plan === FREE
              ? 'public'
              : info.visibility
          }
          initialOwner={authenticatedUser?.id}
          possibleOwners={possibleOwners}
          show={showForkModal}
          onClose={toggleForkModal}
          onFork={onFork}
          currentPlan={authenticatedUser?.plan}
          commitId={commitMetadata?.id}
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
          initialHeight={content.height}
          enableURLChange={true}
          userName={authenticatedUser?.userName}
          initialSlug={info.slug || info.id}
          validateSlug={validateSlug}
        />
      )}
      {showShareModal && (
        <ShareModal
          show={showShareModal}
          onClose={toggleShareModal}
          linkToCopy={linkToCopy}
          onLinkCopy={handleLinkCopy}
          embedSnippetToCopy={embedSnippetToCopy}
          onEmbedSnippetCopy={handleEmbedSnippetCopy}
          anyoneCanEdit={anyoneCanEdit}
          setAnyoneCanEdit={setAnyoneCanEdit}
          showAnyoneCanEdit={showAnyoneCanEdit}
          handleCollaboratorSearch={
            handleCollaboratorSearch
          }
          handleCollaboratorAdd={handleCollaboratorAdd}
          handleCollaboratorRemove={
            handleCollaboratorRemove
          }
          initialCollaborators={initialCollaborators}
          currentPlan={authenticatedUser?.plan || FREE}
          showCollaboratorsSection={
            // info.owner === authenticatedUser?.id
            true
          }
          brandedOption={brandedOption}
          setBrandedOption={setBrandedOption}
          isPrivate={info.visibility === 'private'}
        />
      )}
      {showDeleteVizConfirmationModal && (
        <DeleteVizConfirmationModal
          show={showDeleteVizConfirmationModal}
          onClose={toggleDeleteVizConfirmationModal}
          onConfirm={onTrashViz}
        />
      )}
      {showAIAssistUpgradeNudgeModal && (
        <AIAssistUpgradeNudgeModal
          show={showAIAssistUpgradeNudgeModal}
          onClose={toggleAIAssistUpgradeNudgeModal}
        />
      )}
      {showExportCodeUpgradeNudgeModal && (
        <ExportCodeUpgradeNudgeModal
          show={showExportCodeUpgradeNudgeModal}
          onClose={toggleExportCodeUpgradeNudgeModal}
        />
      )}
      {showEditWithAIModal && (
        <EditWithAIModal
          show={showEditWithAIModal}
          onClose={toggleEditWithAIModal}
          currentPlan={authenticatedUser?.plan || FREE}
          onSubmit={onEditWithAI}
          creditBalance={getCreditBalance(
            authenticatedUser,
          )}
          userId={authenticatedUser?.id}
          modelName={modelName}
          setModelName={setModelName}
          modelNameOptions={modelNameOptions}
          modelNameOptionsFree={modelNameOptionsFree}
        />
      )}
    </>
  );
};

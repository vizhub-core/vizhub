import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  User,
  sortOptions,
  getBio,
  getUserDisplayName,
  FREE,
  APIKey,
  SectionId,
} from 'entities';
import {
  APIKeysList,
  CreateAPIKeyModal,
  DeleteAPIKeyConfirmationModal,
  ProfilePageBody,
  Spinner,
} from 'components';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import { VizPreviewPresenter } from '../../smartComponents/VizPreviewPresenter';
import { InfosAndOwnersContext } from '../../contexts/InfosAndOwnersContext';
import { AuthenticatedUserContext } from '../../contexts/AuthenticatedUserContext';
import { SectionSortContext } from '../../contexts/SectionSortContext';
import { image } from 'components/src/components/image';
import { isFreeTrialEligible } from '../../accessors/isFreeTrialEligible';
import { VizKit } from 'api/src/VizKit';
import { Result, Success } from 'gateways';
import { VizPreviewCollection } from 'components/src/components/VizPreviewCollection';
import { More } from 'components/src/components/More';

const vizKit = VizKit();

export const Body = ({
  profileUser,
}: {
  profileUser: User;
}) => {
  const { userName, picture } = profileUser;
  const authenticatedUser = useContext(
    AuthenticatedUserContext,
  );

  const { sectionId, setSectionId, sortId, setSortId } =
    useContext(SectionSortContext);

  const {
    ownerUserSnapshotsById,
    allInfoSnapshots,
    fetchNextPage,
    isLoadingNextPage,
    hasMore,
  } = useContext(InfosAndOwnersContext);

  const displayName = useMemo(
    () => getUserDisplayName(profileUser),
    [profileUser],
  );

  const bio = useMemo(
    () => getBio(profileUser),
    [profileUser],
  );

  const isViewingOwnProfile =
    authenticatedUser?.id === profileUser.id;

  const showUpgradeCallout =
    isViewingOwnProfile &&
    authenticatedUser?.plan === FREE &&
    sectionId === 'private';

  const renderVizPreviews = useCallback(
    () => (
      <>
        {allInfoSnapshots.map((infoSnapshot) => (
          <VizPreviewPresenter
            key={infoSnapshot.data.id}
            infoSnapshot={infoSnapshot}
            ownerUser={
              // Usually it's the profile user, but not in the
              // "Shared with me" section
              infoSnapshot.data.owner === profileUser.id
                ? profileUser
                : ownerUserSnapshotsById[
                    infoSnapshot.data.owner
                  ].data
            }
          />
        ))}
        {showUpgradeCallout &&
          allInfoSnapshots.length === 0 && (
            <>
              <img
                style={{ width: '100%' }}
                src={image('empty-private-vizzes', 'svg')}
              />
              <img
                style={{ width: '100%' }}
                src={image('empty-private-vizzes', 'svg')}
              />
            </>
          )}
      </>
    ),
    [allInfoSnapshots, profileUser, showUpgradeCallout],
  );

  const enableFreeTrial = useMemo(
    () => isFreeTrialEligible(authenticatedUser),
    [authenticatedUser],
  );

  // TODO hydrate API keys from the server
  // The list of API keys that belong to this user.
  // `null` means that the API keys have not been fetched yet.
  // `'LOADING'` means that the API keys are being fetched.
  const [apiKeys, setAPIKeys] = useState<
    Array<APIKey> | null | 'LOADING'
  >(null);

  useEffect(() => {
    if (
      apiKeys === null &&
      sectionId === SectionId.ApiKeys
    ) {
      const fetchAPIKeys = async () => {
        const apiKeysResult: Result<Array<APIKey>> =
          await vizKit.rest.getAPIKeys();
        if (apiKeysResult.outcome === 'failure') {
          console.error(
            'Failed to fetch API keys:',
            apiKeysResult.error,
          );
          return;
        }
        setAPIKeys(apiKeysResult.value);
      };
      setAPIKeys('LOADING');
      fetchAPIKeys();
    }
  }, [sectionId, apiKeys]);

  const createAPIKey = useCallback(
    async ({ name }: { name: string }) => {
      const generateAPIKeyResult: Result<{
        apiKey: APIKey;
        apiKeyString: string;
      }> = await vizKit.rest.generateAPIKey({ name });

      if (generateAPIKeyResult.outcome === 'failure') {
        console.error(
          'Failed to generate API key:',
          generateAPIKeyResult.error,
        );
        return 'Error';
      }

      const { apiKey, apiKeyString } =
        generateAPIKeyResult.value;

      // Side effect: Add the new API key
      // to the list of API keys that feeds into the UI.
      setAPIKeys((apiKeys) => {
        if (!Array.isArray(apiKeys)) {
          throw new Error(
            'API keys should be an array at this point',
          );
        }
        return [...apiKeys, apiKey];
      });

      // Return the string that the user can copy.
      return apiKeyString;
    },
    [sectionId],
  );

  const [showCreateAPIKeyModal, setShowCreateAPIKeyModal] =
    useState(false);

  const [apiKeyBeingDeleted, setApiKeyBeingDeleted] =
    useState<APIKey | null>(null);

  const handleCreateAPIKeyClick = useCallback(() => {
    setShowCreateAPIKeyModal(true);
  }, []);

  const handleCloseCreateAPIKeyModal = useCallback(() => {
    setShowCreateAPIKeyModal(false);
  }, []);

  const handleDeleteAPIKeyModalClose = useCallback(() => {
    setApiKeyBeingDeleted(null);
  }, []);

  const handleDeleteAPIKeyModalConfirm =
    useCallback(async () => {
      setApiKeyBeingDeleted(null);

      const apiKeysResult: Result<Success> =
        await vizKit.rest.revokeAPIKey(
          apiKeyBeingDeleted.id,
        );
      if (apiKeysResult.outcome === 'failure') {
        console.error(
          'Failed to delete API key:',
          apiKeysResult.error,
        );
        return;
      }

      // Remove the API key from the list after it's been deleted.
      setAPIKeys((apiKeys) => {
        if (!Array.isArray(apiKeys)) {
          throw new Error(
            'API keys should be an array at this point',
          );
        }
        return apiKeys.filter(
          (apiKey) => apiKey.id !== apiKeyBeingDeleted.id,
        );
      });
    }, [apiKeyBeingDeleted]);

  return (
    <div className="vh-page overflow-auto">
      <SmartHeader />
      <ProfilePageBody
        displayName={displayName}
        userName={userName}
        bio={bio}
        picture={picture}
        sortId={sortId}
        setSortId={setSortId}
        sortOptions={sortOptions}
        isViewingOwnProfile={isViewingOwnProfile}
        sectionId={sectionId}
        setSectionId={setSectionId}
        showUpgradeCallout={showUpgradeCallout}
        enableFreeTrial={enableFreeTrial}
        handleCreateAPIKeyClick={handleCreateAPIKeyClick}
        showCreateAPIKeyButton={Array.isArray(apiKeys)}
      >
        {sectionId === SectionId.ApiKeys ? (
          Array.isArray(apiKeys) ? (
            <APIKeysList
              apiKeys={apiKeys}
              setApiKeyBeingDeleted={setApiKeyBeingDeleted}
            />
          ) : (
            <Spinner />
          )
        ) : (
          <>
            <VizPreviewCollection
              opacity={showUpgradeCallout ? 0.5 : 1}
              includeSymbols={false}
            >
              {renderVizPreviews()}
            </VizPreviewCollection>
            <More
              hasMore={hasMore}
              onMoreClick={fetchNextPage}
              isLoadingNextPage={isLoadingNextPage}
            />
          </>
        )}
      </ProfilePageBody>
      <CreateAPIKeyModal
        show={showCreateAPIKeyModal}
        onClose={handleCloseCreateAPIKeyModal}
        createAPIKey={createAPIKey}
      />
      <DeleteAPIKeyConfirmationModal
        show={apiKeyBeingDeleted !== null}
        onClose={handleDeleteAPIKeyModalClose}
        onConfirm={handleDeleteAPIKeyModalConfirm}
      />
    </div>
  );
};

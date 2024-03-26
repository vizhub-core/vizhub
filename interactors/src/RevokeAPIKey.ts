import {
  Gateways,
  Result,
  Success,
  err,
  ok,
} from 'gateways';
import { UserId, APIKeyId } from 'entities';
import { accessDeniedError } from 'gateways/src/errors';

// revokeAPIKey
// * Verifies that the authenticated user
//   is the owner of the API key
// * Deletes the `APIKey` and `APIKeyHash` documents
//   from the database
export const RevokeAPIKey =
  ({
    getAPIKey,
    deleteAPIKey,
    deleteAPIKeyHash,
  }: Gateways) =>
  async ({
    authenticatedUserId,
    apiKeyId,
  }: {
    authenticatedUserId: UserId;
    apiKeyId: APIKeyId;
  }): Promise<Result<Success>> => {
    // Verify that the authenticated user is the owner of the API key.
    const getAPIKeyResult = await getAPIKey(apiKeyId);
    if (getAPIKeyResult.outcome === 'failure') {
      return getAPIKeyResult;
    }
    if (
      getAPIKeyResult.value.owner !== authenticatedUserId
    ) {
      return err(
        accessDeniedError(
          `User ${authenticatedUserId} cannot delete API key that belongs to other user ${getAPIKeyResult.value.owner}`,
        ),
      );
    }

    const deleteAPIKeyResult = await deleteAPIKey(apiKeyId);
    if (deleteAPIKeyResult.outcome === 'failure') {
      return deleteAPIKeyResult;
    }

    const deleteAPIKeyHashResult =
      await deleteAPIKeyHash(apiKeyId);
    if (deleteAPIKeyHashResult.outcome === 'failure') {
      return deleteAPIKeyHashResult;
    }

    return ok('success');
  };

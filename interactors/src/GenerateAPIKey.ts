import crypto from 'crypto';
import { Gateways, Result, ok } from 'gateways';
import {
  UserId,
  APIKey,
  APIKeyId,
  APIKeyHash,
  dateToTimestamp,
  APIKeyPermission,
  Timestamp,
} from 'entities';
import { generateId } from './generateId';

export const computeHash = (apiKey: string): string => {
  return crypto
    .createHash('sha256')
    .update(apiKey)
    .digest('hex');
};

// generatingAPIKey
// * Generates and stores a new `APIKey` and `APIKeyHash`
// * Verifies that the authenticated user
//   is the owner of the API key
// * Returns the `APIKey` and the actual API key string
//   for the user to copy.
export const GenerateAPIKey =
  ({ saveAPIKey, saveAPIKeyHash }: Gateways) =>
  async ({
    owner,
    authenticatedUser,
    timestamp,
  }: {
    owner: UserId;
    authenticatedUser: UserId;
    // The timestamp when the API key was generated.
    timestamp: Timestamp;
  }): Promise<
    Result<{
      apiKey: APIKey;
      apiKeyString: string;
    }>
  > => {
    const id: APIKeyId = generateId();

    const apiKeyString: string =
      generateId() + generateId();

    const hash: string = computeHash(apiKeyString);
    const apiKeyHash: APIKeyHash = { id, hash };
    const apiKey: APIKey = {
      id,
      owner,
      created: timestamp, //dateToTimestamp(new Date()),
      status: 'active',
      permission: APIKeyPermission.WriteAllVizzes,
      usageCount: 0,
    };

    const saveAPIKeyResult = await saveAPIKey(apiKey);
    if (saveAPIKeyResult.outcome === 'failure') {
      return saveAPIKeyResult;
    }

    const saveAPIKeyHashResult =
      await saveAPIKeyHash(apiKeyHash);
    if (saveAPIKeyHashResult.outcome === 'failure') {
      return saveAPIKeyHashResult;
    }

    return ok({
      apiKey,
      apiKeyString,
    });
  };

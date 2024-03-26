import { Gateways, Result, ok } from 'gateways';
import { UserId, APIKey } from 'entities';
import { computeHash } from './computeHash';

// getAPIKeyOwner
// * Look up the `APIKeyHash` for the given `apiKeyString`
// * Look up the corresponding `APIKey` metadata
// * Return the `APIKey` metadata owner
export const GetAPIKeyOwner =
  ({ getAPIKey, getAPIKeyIdFromHash }: Gateways) =>
  async (apiKeyString: string): Promise<Result<UserId>> => {
    const hash: string = computeHash(apiKeyString);
    const apiKeyIdResult = await getAPIKeyIdFromHash(hash);
    if (apiKeyIdResult.outcome === 'failure') {
      return apiKeyIdResult;
    }
    const apiKeyId = apiKeyIdResult.value;
    const apiKeyResult = await getAPIKey(apiKeyId);
    if (apiKeyResult.outcome === 'failure') {
      return apiKeyResult;
    }
    const apiKey: APIKey = apiKeyResult.value;
    return ok(apiKey.owner);
  };

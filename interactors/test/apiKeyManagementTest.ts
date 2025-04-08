import { initGateways } from 'gateways/test';
import { assert, describe, expect, it } from 'vitest';
import { GenerateAPIKey } from '../src';
import { ts1 } from 'entities/test/fixtures';

export const apiKeyManagementTest = () => {
  describe('apiKeyManagement', async () => {
    // This is a no-op case.
    // It should do nothing and return "success".
    it('generateAPIKey', async () => {
      const gateways = await initGateways();

      const generateAPIKey = GenerateAPIKey(gateways);

      const generateAPIKeyResult = await generateAPIKey({
        owner: 'user1',
        timestamp: ts1,
        name: 'test',
      });

      expect(generateAPIKeyResult.outcome).toBe('success');
      assert(generateAPIKeyResult.outcome !== 'failure');
      expect(generateAPIKeyResult.value).toEqual({
        apiKey: {
          id: '102',
          name: 'test',
          owner: 'user1',
          created: ts1,
          status: 'active',
          permission: 'write_all_vizzes',
          usageCount: 0,
        },
        apiKeyString: '103104',
      });
    });
  });
  // Create API Key, success case
  // Create API Key, failure case (owner mismatch with authenticated user)
  // Delete API Key, success case
  // Delete API Key, failure case (owner mismatch with authenticated user)
};

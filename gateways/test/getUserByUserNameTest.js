import { initGateways } from './initGateways';
import { userJoe } from './fixtures';
import { describe, it, expect } from 'vitest';

export const getUserByUserNameTest = () => {
  describe('getUserByUserName', () => {
    it('getUserByUserName success', async () => {
      const gateways = await initGateways();
      const { saveUser, getUserByUserName } = gateways;
      await saveUser(userJoe);
      const result = await getUserByUserName('joe');
      expect(result.outcome).toEqual('success');
      expect(result.value.data).toEqual(userJoe);
    });

    it('getUserByUserName failure, missing user', async () => {
      const gateways = await initGateways();
      const { saveUser, getUserByUserName } = gateways;
      await saveUser(userJoe);
      const result =
        await getUserByUserName('unknown-user');
      expect(result.outcome).toEqual('failure');
      expect(result.error.code).toEqual('resourceNotFound');
      expect(result.error.message).toEqual(
        'Resource not found with id: unknown-user',
      );
    });
  });
};

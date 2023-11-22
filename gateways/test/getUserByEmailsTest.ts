import { initGateways } from './initGateways';
import { userJoe } from 'entities/test/fixtures';
import { describe, it, expect, assert } from 'vitest';

export const getUserByEmailsTest = () => {
  describe('getUserByEmails', () => {
    it('getUserByEmails, primary email', async () => {
      const gateways = await initGateways();
      const { saveUser, getUserByEmails } = gateways;
      await saveUser(userJoe);
      const result = await getUserByEmails([
        'joe@shmoe.com',
      ]);
      assert(result.outcome === 'success');
      expect(result.value.data).toEqual(userJoe);
    });

    it('getUserByEmails, secondary email', async () => {
      const gateways = await initGateways();
      const { saveUser, getUserByEmails } = gateways;
      await saveUser(userJoe);
      const result1 = await getUserByEmails([
        'joe@hugecorp.com',
      ]);
      assert(result1.outcome === 'success');
      expect(result1.value.data).toEqual(userJoe);
      const result2 = await getUserByEmails([
        'joe@joes-diner.com',
      ]);
      assert(result2.outcome === 'success');
      expect(result2.value.data).toEqual(userJoe);
    });
  });
};

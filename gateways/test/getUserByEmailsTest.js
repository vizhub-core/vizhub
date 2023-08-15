import { initGateways } from './initGateways';
import { userJoe } from './fixtures';
import { describe, it, expect } from 'vitest';

export const getUserByEmailsTest = () => {
  describe('getUserByEmails', () => {
    it('getUserByEmails, primary email', async () => {
      const gateways = await initGateways();
      const { saveUser, getUserByEmails } = gateways;
      await saveUser(userJoe);
      const result = await getUserByEmails([
        'joe@shmoe.com',
      ]);
      expect(result.value.data).toEqual(userJoe);
    });

    it('getUserByEmails, secondary email', async () => {
      const gateways = await initGateways();
      const { saveUser, getUserByEmails } = gateways;
      await saveUser(userJoe);
      expect(
        (await getUserByEmails(['joe@hugecorp.com'])).value
          .data,
      ).toEqual(userJoe);
      expect(
        (await getUserByEmails(['joe@joes-diner.com']))
          .value.data,
      ).toEqual(userJoe);
    });
  });
};

import { initGateways } from './initGateways';
import { userJoe } from './fixtures';
import { describe, it, expect, assert } from 'vitest';
import { Snapshot, User } from 'entities';
import { Result } from '../src';

export const getUsersByIdsTest = () => {
  describe('getUsersByIds', () => {
    it('getUsersByIds, one user, success', async () => {
      const gateways = await initGateways();
      const { saveUser, getUsersByIds } = gateways;
      await saveUser(userJoe);
      const result: Result<Array<Snapshot<User>>> =
        await getUsersByIds([userJoe.id]);
      assert(result.outcome === 'success');
      expect(result.value.map(({ data }) => data)).toEqual([
        userJoe,
      ]);
    });
    it('getUsersByIds, one user, failure', async () => {
      const gateways = await initGateways();
      const { getUsersByIds } = gateways;

      const result: Result<Array<Snapshot<User>>> =
        await getUsersByIds([userJoe.id]);
      assert(result.outcome === 'failure');
      expect(result.error.message).toEqual(
        `Resource (User) not found with id: ${userJoe.id}`,
      );
    });
  });
};

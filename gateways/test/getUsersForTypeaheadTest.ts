import { describe, it, expect, assert } from 'vitest';
import { Snapshot, User } from 'entities';
import { userJane, userJoe } from 'entities/test/fixtures';
import { initGateways } from './initGateways';
import { Result } from '../src';

export const getUsersForTypeaheadTest = () => {
  describe('getUsersForTypeahead', () => {
    it('getUsersForTypeahead', async () => {
      const gateways = await initGateways();
      const { saveUser, getUsersForTypeahead } = gateways;
      await saveUser(userJoe);
      await saveUser(userJane);

      // Search for joe
      const result: Result<Array<User>> =
        await getUsersForTypeahead('jo');
      assert(result.outcome === 'success');
      expect(result.value).toEqual([userJoe]);

      // Search for jane
      const result2: Result<Array<User>> =
        await getUsersForTypeahead('ja');
      assert(result2.outcome === 'success');
      expect(result2.value).toEqual([userJane]);

      // Search for "j"
      const result3: Result<Array<User>> =
        await getUsersForTypeahead('j');
      assert(result3.outcome === 'success');
      expect(result3.value).toEqual([userJoe, userJane]);
    });
  });
};

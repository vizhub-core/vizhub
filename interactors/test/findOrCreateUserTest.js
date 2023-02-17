// See also
// https://github.com/vizhub-core/vizhub/blob/main/vizhub-v3/vizhub-interactors/test/FindOrCreateUserTest.ts
import { userJoe } from 'gateways/test';
import { describe, it, expect } from 'vitest';
import { initGateways } from './initGateways';
import { FindOrCreateUser, setPredictableGenerateId } from '../src';

export const findOrCreateUserTest = () => {
  describe('findOrCreateUser', async () => {
    setPredictableGenerateId();
    it('should find an existing user', async () => {
      const gateways = initGateways();
      const { saveUser } = gateways;
      const findOrCreateUser = FindOrCreateUser(gateways);

      await saveUser(userJoe);

      const result = await findOrCreateUser({
        // TODO update this to structurally match the latest
        // profile data we actually get from Google

        googleProfileData: {
          displayName: 'Joe Shmoe',
          emails: [{ value: 'joe@shmoe.com' }],
        },

        // TODO update this to structurally match the latest
        // profile data we actually get from GitHub
        // githubProfile: {
        // },
      });

      expect(result.outcome).toEqual('success');
      expect(result.value.data).toEqual(userJoe);
    });

    it('should create a new user', async () => {
      const gateways = initGateways();
      const findOrCreateUser = FindOrCreateUser(gateways);

      const result = await findOrCreateUser({
        googleProfileData: {
          displayName: 'David Goggins',
          emails: [{ value: 'david@goggins.com' }],
        },
      });

      expect(result.outcome).toEqual('success');

      expect(result.value.data).toEqual({
        id: '100',
        primaryEmail: 'david@goggins.com',
        userName: '101',
        displayName: 'David Goggins',
        profiles: {
          googleProfileData: {
            displayName: 'David Goggins',
            emails: [{ value: 'david@goggins.com' }],
          },
        },
      });
    });
  });
};

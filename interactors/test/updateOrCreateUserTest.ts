// See also
// https://github.com/vizhub-core/vizhub/blob/main/vizhub-v3/vizhub-interactors/test/FindOrCreateUserTest.ts
import { describe, it, expect, assert } from 'vitest';
import { initGateways } from './initGateways';
import { UpdateOrCreateUser } from '../src';
import { User } from 'entities';

// This is what we get from Auth0.
const claims = {
  nickname: 'curran',
  name: 'Curran Kelleher',
  picture:
    'https://avatars.githubusercontent.com/u/68416?v=4',
  updated_at: '2023-04-11T11:30:03.680Z',
  email: 'curran.kelleher@gmail.com',
  email_verified: true,
  iss: 'https://dev-5yxv3gr1hiwuvv46.us.auth0.com/',
  aud: 'faBeeyfQBSm11XbTLZ25AMTDmp3noHnJ',
  iat: 1681212844,
  exp: 1681248844,
  sub: 'github|68416',
  sid: 'HIUOoaC_USzcL3hni_1skATDZO4ABVRs',
  nonce: '_2chroq4hfghgsxa8RJHDhJqNIjYB7VjPa5U9B3Jins',
};

// VizHub 2 used the GitHub id as the user id,
// so let's use that here as well so that users of
// VizHub 2 can log into VizHub 3 and access their accounts.
const id = claims.sub.startsWith('github')
  ? claims.sub.substring(7)
  : claims.sub;

// Options passed to updateOrCreateUserTest throughout tests.
const options = {
  id,
  userName: claims.nickname,
  displayName: claims.name,
  email: claims.email,
  picture: claims.picture,
};

export const expectedUser: User = {
  id: options.id,
  primaryEmail: options.email,
  secondaryEmails: [],
  userName: options.userName,
  displayName: options.displayName,
  picture: options.picture,
  plan: 'free',
};

export const updateOrCreateUserTest = () => {
  describe('updateOrCreateUser', async () => {
    it('should create a new user', async () => {
      const gateways = initGateways();
      const { getUser } = gateways;
      const updateOrCreateUser =
        UpdateOrCreateUser(gateways);

      const result = await updateOrCreateUser(options);

      assert(result.outcome === 'success');
      expect(result.value).toEqual('success');

      const getUserResult = await getUser(id);
      assert(getUserResult.outcome === 'success');

      expect(getUserResult.value.data).toEqual(
        expectedUser,
      );
    });

    it('should update an existing user', async () => {
      const gateways = initGateways();
      const { saveUser, getUser } = gateways;
      const updateOrCreateUser =
        UpdateOrCreateUser(gateways);

      const existingUser = {
        ...expectedUser,
        displayName: 'Schmurran Schmellemer',
        picture:
          'https://avatars.poopinyourpants.com/u/68416?v=4',
      };
      await saveUser(existingUser);

      // Sanity check
      const getUserResult = await getUser(id);
      assert(getUserResult.outcome === 'success');
      expect(getUserResult.value.data).toEqual(
        existingUser,
      );

      const result = await updateOrCreateUser(options);

      assert(result.outcome === 'success');
      expect(result.value).toEqual('success');

      const getUserResult2 = await getUser(id);
      assert(getUserResult2.outcome === 'success');
      expect(getUserResult2.value.data).toEqual(
        expectedUser,
      );
    });

    it('should update an existing user and preserve plan', async () => {
      const gateways = initGateways();
      const { saveUser, getUser } = gateways;
      const updateOrCreateUser =
        UpdateOrCreateUser(gateways);

      const existingUser = {
        ...expectedUser,
        displayName: 'Schmurran Schmellemer',
        picture:
          'https://avatars.poopinyourpants.com/u/68416?v=4',
        plan: 'pro',
      };
      await saveUser(existingUser);

      // Sanity check
      expect((await getUser(id)).value.data).toEqual(
        existingUser,
      );

      const result = await updateOrCreateUser(options);

      expect(result.outcome).toEqual('success');
      expect(result.value).toEqual('success');

      expect(
        (await getUser(options.id)).value.data,
      ).toEqual({
        ...expectedUser,
        plan: 'pro',
      });
    });

    //    it('should update an existing user', async () => {
    //      const gateways = initGateways();
    //      const { saveUser } = gateways;
    //      const updateOrCreateUser = UpdateOrCreateUser(gateways);
    //
    //      await saveUser(userJoe);
    //
    //      const result = await updateOrCreateUser({});
    //
    //      expect(result.outcome).toEqual('success');
    //      expect(result.value.data).toEqual(userJoe);
    //    });
  });
};

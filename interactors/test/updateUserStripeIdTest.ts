// See also
// https://github.com/vizhub-core/vizhub/blob/main/vizhub-v3/vizhub-interactors/test/FindOrCreateUserTest.ts
import { describe, it, expect, assert } from 'vitest';
import { initGateways } from './initGateways';
import { UpdateUserStripeId } from '../src';
import { expectedUser as existingUser } from './updateOrCreateUserTest';
import { UserId } from 'entities';

export const updateUserStripeIdTest = () => {
  describe('updateUserStripeId', async () => {
    it('should update a user stripe id', async () => {
      ////////// Setup
      const gateways = initGateways();
      const { saveUser, getUser } = gateways;
      await saveUser(existingUser);
      const userId: UserId = existingUser.id;

      // Sanity check
      const existingUserResult = await getUser(userId);
      assert(existingUserResult.outcome === 'success');
      expect(existingUserResult.value.data).toEqual(
        existingUser,
      );
      ////////// Invocation
      const updateUserStripeId =
        UpdateUserStripeId(gateways);

      const stripeCustomerId = 'cus_123';

      const result = await updateUserStripeId({
        userId,
        stripeCustomerId,
      });

      assert(result.outcome === 'success');
      expect(result.value).toEqual('success');

      const updatedUserResult = await getUser(userId);
      assert(updatedUserResult.outcome === 'success');
      expect(
        updatedUserResult.value.data.stripeCustomerId,
      ).toEqual(stripeCustomerId);
    });
  });
};

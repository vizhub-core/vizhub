import { describe, it, expect, assert } from 'vitest';
import { initGateways } from 'gateways/test';
import { CheckExportLimit, IncrementExportCount } from '../src';
import { User, FREE, PREMIUM, FREE_EXPORTS_PER_MONTH } from 'entities';

const freeUser: User = {
  id: 'free-user-123',
  primaryEmail: 'free@example.com',
  secondaryEmails: [],
  userName: 'freeuser',
  displayName: 'Free User',
  plan: FREE,
  numUnreadNotifications: 0,
};

const premiumUser: User = {
  id: 'premium-user-456',
  primaryEmail: 'premium@example.com',
  secondaryEmails: [],
  userName: 'premiumuser',
  displayName: 'Premium User',
  plan: PREMIUM,
  numUnreadNotifications: 0,
};

const vizOwner: User = {
  id: 'viz-owner-789',
  primaryEmail: 'owner@example.com',
  secondaryEmails: [],
  userName: 'vizowner',
  displayName: 'Viz Owner',
  plan: FREE,
  numUnreadNotifications: 0,
};

export const checkExportLimitTest = () => {
  describe('checkExportLimit', async () => {
    it('should allow free user to export their own viz', async () => {
      const gateways = await initGateways();
      const { saveUser } = gateways;
      const checkExportLimit = CheckExportLimit(gateways);

      await saveUser(freeUser);

      const result = await checkExportLimit({
        userId: freeUser.id,
        vizOwnerId: freeUser.id, // Same user
      });

      assert(result.outcome === 'success');
      expect(result.value).toEqual('success');
    });

    it('should allow premium user unlimited exports', async () => {
      const gateways = await initGateways();
      const { saveUser } = gateways;
      const checkExportLimit = CheckExportLimit(gateways);

      await saveUser(premiumUser);
      await saveUser(vizOwner);

      const result = await checkExportLimit({
        userId: premiumUser.id,
        vizOwnerId: vizOwner.id,
      });

      assert(result.outcome === 'success');
      expect(result.value).toEqual('success');
    });

    it('should allow free user to export others vizzes within limit', async () => {
      const gateways = await initGateways();
      const { saveUser } = gateways;
      const checkExportLimit = CheckExportLimit(gateways);

      await saveUser(freeUser);
      await saveUser(vizOwner);

      const result = await checkExportLimit({
        userId: freeUser.id,
        vizOwnerId: vizOwner.id,
      });

      assert(result.outcome === 'success');
      expect(result.value).toEqual({ remainingExports: FREE_EXPORTS_PER_MONTH });
    });

    it('should deny free user export when limit exceeded', async () => {
      const gateways = await initGateways();
      const { saveUser } = gateways;
      const checkExportLimit = CheckExportLimit(gateways);

      const currentMonth = new Date().toISOString().slice(0, 7);
      const freeUserAtLimit: User = {
        ...freeUser,
        exportCountByMonth: {
          [currentMonth]: FREE_EXPORTS_PER_MONTH,
        },
      };

      await saveUser(freeUserAtLimit);
      await saveUser(vizOwner);

      const result = await checkExportLimit({
        userId: freeUser.id,
        vizOwnerId: vizOwner.id,
      });

      assert(result.outcome === 'failure');
      expect(result.error.name).toBe('ExportLimitExceeded');
      expect(result.error.message).toContain('Free plan users can export up to 5');
    });
  });

  describe('incrementExportCount', async () => {
    it('should not increment count for own viz exports', async () => {
      const gateways = await initGateways();
      const { saveUser, getUser } = gateways;
      const incrementExportCount = IncrementExportCount(gateways);

      await saveUser(freeUser);

      const result = await incrementExportCount({
        userId: freeUser.id,
        vizOwnerId: freeUser.id, // Same user
      });

      assert(result.outcome === 'success');

      // Check that count was not incremented
      const getUserResult = await getUser(freeUser.id);
      assert(getUserResult.outcome === 'success');
      const updatedUser = getUserResult.value.data;
      expect(updatedUser.exportCountByMonth).toBeUndefined();
    });

    it('should not increment count for premium users', async () => {
      const gateways = await initGateways();
      const { saveUser, getUser } = gateways;
      const incrementExportCount = IncrementExportCount(gateways);

      await saveUser(premiumUser);
      await saveUser(vizOwner);

      const result = await incrementExportCount({
        userId: premiumUser.id,
        vizOwnerId: vizOwner.id,
      });

      assert(result.outcome === 'success');

      // Check that count was not incremented
      const getUserResult = await getUser(premiumUser.id);
      assert(getUserResult.outcome === 'success');
      const updatedUser = getUserResult.value.data;
      expect(updatedUser.exportCountByMonth).toBeUndefined();
    });

    it('should increment count for free user exporting others vizzes', async () => {
      const gateways = await initGateways();
      const { saveUser, getUser } = gateways;
      const incrementExportCount = IncrementExportCount(gateways);

      await saveUser(freeUser);
      await saveUser(vizOwner);

      const result = await incrementExportCount({
        userId: freeUser.id,
        vizOwnerId: vizOwner.id,
      });

      assert(result.outcome === 'success');

      // Check that count was incremented
      const getUserResult = await getUser(freeUser.id);
      assert(getUserResult.outcome === 'success');
      const updatedUser = getUserResult.value.data;
      const currentMonth = new Date().toISOString().slice(0, 7);
      expect(updatedUser.exportCountByMonth?.[currentMonth]).toBe(1);
    });

    it('should increment count correctly for multiple exports', async () => {
      const gateways = await initGateways();
      const { saveUser, getUser } = gateways;
      const incrementExportCount = IncrementExportCount(gateways);

      await saveUser(freeUser);
      await saveUser(vizOwner);

      // First export
      await incrementExportCount({
        userId: freeUser.id,
        vizOwnerId: vizOwner.id,
      });

      // Second export
      await incrementExportCount({
        userId: freeUser.id,
        vizOwnerId: vizOwner.id,
      });

      // Check that count is 2
      const getUserResult = await getUser(freeUser.id);
      assert(getUserResult.outcome === 'success');
      const updatedUser = getUserResult.value.data;
      const currentMonth = new Date().toISOString().slice(0, 7);
      expect(updatedUser.exportCountByMonth?.[currentMonth]).toBe(2);
    });
  });
};
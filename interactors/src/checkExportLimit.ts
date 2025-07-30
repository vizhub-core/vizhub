import { Result, Success, ok, err } from 'gateways';
import {
  User,
  UserId,
  userLock,
  FREE,
  FREE_EXPORTS_PER_MONTH,
} from 'entities';

// CheckExportLimit
//
// * Checks if a user can export another user's viz based on their plan and current usage
// * For free users, enforces the monthly limit on exporting other users' vizzes
// * Premium and professional users have unlimited exports
// * Returns an error if the limit would be exceeded
export const CheckExportLimit =
  (gateways) =>
  async (options: {
    userId: UserId;
    vizOwnerId: UserId;
  }): Promise<
    Result<Success | { remainingExports: number }>
  > => {
    const { userId, vizOwnerId } = options;
    const { getUser } = gateways;

    // If user is exporting their own viz, no limit applies
    if (userId === vizOwnerId) {
      return ok('success');
    }

    const userResult = await getUser(userId);
    if (userResult.outcome === 'failure') {
      return userResult;
    }

    const user: User = userResult.value.data;

    // If user is not on free plan, no limit applies
    if (user.plan !== FREE) {
      return ok('success');
    }

    // Check current month's export count for free plan users
    const currentMonth = new Date()
      .toISOString()
      .slice(0, 7); // YYYY-MM format
    const currentMonthExports =
      user.exportCountByMonth?.[currentMonth] || 0;

    if (currentMonthExports >= FREE_EXPORTS_PER_MONTH) {
      return err({
        name: 'ExportLimitExceeded',
        message: `Free plan users can export up to ${FREE_EXPORTS_PER_MONTH} other users' vizzes per month. Upgrade to Premium for unlimited exports.`,
      });
    }

    return ok({
      remainingExports:
        FREE_EXPORTS_PER_MONTH - currentMonthExports,
    });
  };

// IncrementExportCount
//
// * Increments the export count for a free plan user when they export another user's viz
// * Does nothing for premium/professional users or when exporting own vizzes
export const IncrementExportCount =
  (gateways) =>
  async (options: {
    userId: UserId;
    vizOwnerId: UserId;
  }): Promise<Result<Success>> => {
    const { userId, vizOwnerId } = options;
    const { getUser, saveUser, lock } = gateways;

    // If user is exporting their own viz, no counting needed
    if (userId === vizOwnerId) {
      return ok('success');
    }

    return await lock([userLock(userId)], async () => {
      const userResult = await getUser(userId);
      if (userResult.outcome === 'failure') {
        return userResult;
      }

      const user: User = userResult.value.data;

      // If user is not on free plan, no counting needed
      if (user.plan !== FREE) {
        return ok('success');
      }

      // Increment export count for current month
      const currentMonth = new Date()
        .toISOString()
        .slice(0, 7); // YYYY-MM format
      if (!user.exportCountByMonth) {
        user.exportCountByMonth = {};
      }
      user.exportCountByMonth[currentMonth] =
        (user.exportCountByMonth[currentMonth] || 0) + 1;

      await saveUser(user);
      return ok('success');
    });
  };

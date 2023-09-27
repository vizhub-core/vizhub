import { Gateways, Result, Success, ok } from 'gateways';
import { User, UserId } from 'entities';

// updateUserStripeId
// TODO rename to upgradeUser
//
// * This is for when a user upgrades
// * we link their Stripe customer ID to their user
// * we also update their user to be a pro user
export const UpdateUserStripeId =
  (gateways: Gateways) =>
  async (options: {
    userId: UserId;
    stripeCustomerId: string;
  }): Promise<Result<Success>> => {
    const { userId, stripeCustomerId } = options;
    const { saveUser, getUser } = gateways;

    // TODO redlock
    const result = await getUser(userId);

    // This user will be either an existing user or a newly created user.
    let user: User;

    // If we found one, great, use that one.
    if (result.outcome === 'success') {
      user = result.value.data;

      // Update the stripeCustomerId
      user.stripeCustomerId = stripeCustomerId;

      // Update the plan to be pro
      user.plan = 'pro';

      // Save the updated or newly created user.
      await saveUser(user);
    } else {
      // If we didn't find an existing user,
      // return an error result.
      return result;
    }

    return ok('success');
  };
import { Result, Success, ok } from 'gateways';
import { User, UserId } from 'entities';

// updateUserStripeId
//
// * This is for when a user upgrades and we link their Stripe customer ID to their user.
export const UpdateUserStripeId =
  (gateways) =>
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

      // Save the updated or newly created user.
      await saveUser(user);
    } else {
      // If we didn't find an existing user,
      // return an error result.
      return result;
    }

    return ok('success');
  };

import { Gateways, Result, Success, ok } from 'gateways';
import { Plan, User, UserId } from 'entities';

// updateUserStripeId
// TODO rename to updateUserPlan
//
// * This is for when a user upgrades
// * we link their Stripe customer ID to their user
// * we also update their user to be a pro user
export const UpdateUserStripeId =
  (gateways: Gateways) =>
  async ({
    userId,
    stripeCustomerId,
    plan,
  }: {
    userId: UserId;
    stripeCustomerId: string;
    plan: Plan;
  }): Promise<Result<Success>> => {
    const { saveUser, getUser } = gateways;

    const result = await getUser(userId);

    // This user will be either an existing user or a newly created user.
    let user: User;

    // If we found one, great, use that one.
    if (result.outcome === 'success') {
      user = result.value.data;

      // Update the stripeCustomerId
      user.stripeCustomerId = stripeCustomerId;

      // Update the plan.
      user.plan = plan;

      // Save the updated or newly created user.
      await saveUser(user);
    } else {
      // If we didn't find an existing user,
      // return an error result.
      return result;
    }

    return ok('success');
  };

import { User } from 'entities';

export const isFreeTrialEligible = (
  authenticatedUser: User | null,
) =>
  authenticatedUser
    ? !authenticatedUser.stripeCustomerId
    : true;

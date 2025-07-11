import { User } from 'entities';
import {
  PRO_CREDITS_PER_MONTH,
  FREE_CREDITS_PER_MONTH,
  PREMIUM_CREDITS_PER_MONTH,
  STARTING_CREDITS,
  FREE,
  PREMIUM,
  PRO,
} from '../Pricing';

export const getNonExpiringCreditBalance = (
  user?: User,
) => {
  // If the user is defined,
  const nonExpiringCreditBalance = user
    ? // if the user's credit balance is undefined,
      // it means they signed up and
      user.creditBalance === undefined ||
      user.creditBalance === null
      ? // are eligible for the starting credits.
        STARTING_CREDITS
      : // Otherwise, they have a balance tracked,
        // so return it.
        user.creditBalance
    : // Otherwise, return 0 for non-logged-in users.
      0;

  return nonExpiringCreditBalance;
};

export const getExpiringCreditBalance = (user?: User) => {
  let expiringCreditBalance = 0;
  if (user) {
    const currentMonth = new Date()
      .toISOString()
      .slice(0, 7);

    switch (user.plan) {
      case FREE:
        expiringCreditBalance =
          user.freeCreditBalanceByMonth?.[currentMonth] ??
          FREE_CREDITS_PER_MONTH;
        break;
      case PREMIUM:
        expiringCreditBalance =
          user.premiumCreditBalanceByMonth?.[
            currentMonth
          ] ?? PREMIUM_CREDITS_PER_MONTH;
        break;
      case PRO:
        expiringCreditBalance =
          user.proCreditBalanceByMonth?.[currentMonth] ??
          PRO_CREDITS_PER_MONTH;
        break;
      default:
        expiringCreditBalance = 0;
    }
  }
  return expiringCreditBalance;
};

// Gets the AI Credit Balance for a user.
export const getCreditBalance = (user?: User) => {
  return (
    getNonExpiringCreditBalance(user) +
    getExpiringCreditBalance(user)
  );
};

import { User } from 'entities';
import {
  PRO_CREDITS_PER_MONTH,
  STARTING_CREDITS,
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
  if (user && user.plan === 'professional') {
    const currentMonth = new Date()
      .toISOString()
      .slice(0, 7);
    expiringCreditBalance =
      user.proCreditBalanceByMonth?.[currentMonth] ===
      undefined
        ? PRO_CREDITS_PER_MONTH
        : user.proCreditBalanceByMonth?.[currentMonth];
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

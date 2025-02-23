import { User } from 'entities';
import { STARTING_CREDITS } from '../Pricing';

// Gets the AI Credit Balance for a user.
export const getCreditBalance = (user?: User) =>
  // If the user is defined,
  user
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

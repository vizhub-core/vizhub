import Stripe from 'stripe';

let stripe: Stripe;

// Lazily instantiate Stripe so that it's possible to
// develop locally without having to set up Stripe environment variables.
export const getStripe = () => {
  if (!stripe) {
    stripe = new Stripe(
      process.env.VIZHUB_STRIPE_SECRET_KEY,
      {
        apiVersion: '2025-02-24.acacia',
      },
    );
  }
  return stripe;
};

import Stripe from 'stripe';

let stripe;

// Lazily instantiate Stripe so that it's possible to
// develop locally without having to set up Stripe environment variables.
export const getStripe = () => {
  if (!stripe) {
    stripe = new Stripe(
      process.env.VIZHUB_STRIPE_SECRET_KEY,
      {
        apiVersion: '2023-08-16',
      },
    );
  }
  return stripe;
};

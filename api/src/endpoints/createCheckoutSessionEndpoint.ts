import express from 'express';
import { err, ok } from 'gateways';
import { parseAuth0User } from '..';
import { authenticationRequiredError } from 'gateways/src/errors';
import { getStripe } from './getStripe';

export const createCheckoutSession = ({ app }) => {
  app.post(
    '/api/create-checkout-session',
    express.json({ type: 'application/json' }),
    async (req, res) => {
      // Get at the currently authenticated user.
      const auth0User = req?.oidc?.user || null;

      const { authenticatedUserId } =
        parseAuth0User(auth0User);

      // Having the User ID is required to create a Stripe
      // Checkout Session. Without it, we can't associate
      // the Stripe Customer with the VizHub User after
      // the Checkout Session is completed.
      if (!authenticatedUserId) {
        res.json(err(authenticationRequiredError()));
        return;
      }

      const stripe = getStripe();

      // https://stripe.com/docs/api/checkout/sessions/create#create_checkout_session-client_reference_id
      const session = await stripe.checkout.sessions.create(
        {
          // TODO consider making the base URL configurable
          success_url: 'https://beta.vizhub.com/account',
          line_items: [
            {
              price: process.env.VIZHUB_STRIPE_PRICE_ID,
              quantity: 1,
            },
          ],
          mode: 'subscription',
          client_reference_id: authenticatedUserId,
          trial_period_days: 30, // This adds a 30-day free trial
        },
      );
      res.json(ok({ sessionURL: session.url }));
    },
  );
};

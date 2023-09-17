import express from 'express';
import { err, ok } from 'gateways';
import Stripe from 'stripe';
import { parseAuth0User } from '..';
import { authenticationRequiredError } from 'gateways/src/errors';

let stripe;

export const createCheckoutSession = ({ app }) => {
  if (!stripe) {
    stripe = new Stripe(
      process.env.VIZHUB_STRIPE_SECRET_KEY,
      {
        apiVersion: '2023-08-16',
      },
    );
  }
  app.post(
    '/api/create-checkout-session',
    express.json({ type: 'application/json' }),
    async (req, res) => {
      console.log(
        'reveiced request to create checkout session',
      );

      // Get at the currently authenticated user.
      const auth0User = req?.oidc?.user || null;

      const { authenticatedUserId } =
        parseAuth0User(auth0User);
      console.log(
        'authenticatedUserId',
        authenticatedUserId,
      );

      // Having the User ID is required to create a Stripe
      // Checkout Session. Without it, we can't associate
      // the Stripe Customer with the VizHub User after
      // the Checkout Session is completed.
      if (!authenticatedUserId) {
        res.json(err(authenticationRequiredError()));
        return;
      }

      // https://stripe.com/docs/api/checkout/sessions/create#create_checkout_session-client_reference_id
      const session = await stripe.checkout.sessions.create(
        {
          success_url: 'https://example.com/success',
          line_items: [
            {
              price: process.env.VIZHUB_STRIPE_PRICE_ID,
              quantity: 1,
            },
          ],
          mode: 'subscription',
          client_reference_id: authenticatedUserId,
        },
      );
      res.json(ok({ sessionURL: session.url }));
    },
  );
};

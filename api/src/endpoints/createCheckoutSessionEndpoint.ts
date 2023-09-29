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
          mode: 'subscription',
          // TODO consider making the base URL configurable
          success_url: 'https://beta.vizhub.com/account',
          cancel_url: 'https://beta.vizhub.com/account',
          client_reference_id: authenticatedUserId,
          line_items: [
            {
              price: process.env.VIZHUB_STRIPE_PRICE_ID,
              quantity: 1,
            },
          ],

          // 30 day free trial
          // See https://stripe.com/docs/payments/checkout/free-trials
          subscription_data: {
            trial_settings: {
              end_behavior: {
                missing_payment_method: 'cancel',
              },
            },
            trial_period_days: 30,
          },

          // Yes, we do always want to collect payment method.
          // By signing up, the user is agreeing to pay for the
          // service, so we want to collect payment method
          // regardless of whether they have a coupon or not.

          // If they have a coupon for one free year that comes with
          // joining the beta, then they will get a free year.

          payment_method_collection: 'always',

          allow_promotion_codes: true,

          // discounts: [
          //   {
          //     coupon: process.env.VIZHUB_STRIPE_COUPON_ID,
          //   },
          // ],
        },
      );
      res.json(ok({ sessionURL: session.url }));
    },
  );
};

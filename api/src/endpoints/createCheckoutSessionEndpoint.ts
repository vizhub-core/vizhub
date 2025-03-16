import express from 'express';
import { Gateways, err, ok } from 'gateways';
import { authenticationRequiredError } from 'gateways/src/errors';
import { getAuthenticatedUserId } from '../parseAuth0User';
import { getNewStripe } from './getStripe';
import Stripe from 'stripe';

export const createCheckoutSession = ({
  app,
  gateways,
}: {
  app: express.Express;
  gateways: Gateways;
}) => {
  app.post(
    '/api/create-checkout-session',
    express.json({ type: 'application/json' }),
    async (req, res) => {
      const authenticatedUserId =
        getAuthenticatedUserId(req);

      // Having the User ID is required to create a Stripe
      // Checkout Session. Without it, we can't associate
      // the Stripe Customer with the VizHub User after
      // the Checkout Session is completed.
      if (!authenticatedUserId) {
        res.json(err(authenticationRequiredError()));
        return;
      }

      const userResult = await gateways.getUser(
        authenticatedUserId,
      );
      if (userResult.outcome === 'failure') {
        res.json(err(userResult.error));
        return;
      }

      const stripe = getNewStripe();

      // @ts-ignore
      const urlBase = req.headers.origin;

      // Redirect to the profile page after successful payment.
      // const success_url = `${urlBase}/${authenticatedUser.userName}`;
      // TODO redirect to a dedicated "Welcome to VizHub Premium" page
      const success_url = `${urlBase}/pricing`;
      const cancel_url = success_url;

      const { isMonthly, isCreditTopUp } = req.body;

      const price = isCreditTopUp
        ? process.env.VIZHUB_CREDIT_TOP_UP_STRIPE_PRICE_ID
        : isMonthly
          ? process.env
              .VIZHUB_PREMIUM_MONTHLY_STRIPE_PRICE_ID
          : process.env
              .VIZHUB_PREMIUM_ANNUAL_STRIPE_PRICE_ID;

      // This is the config for subscriptions
      const lineItem: Stripe.Checkout.SessionCreateParams.LineItem =
        {
          price,
          quantity: 1,
        };

      // https://stripe.com/docs/api/checkout/sessions/create#create_checkout_session-client_reference_id
      const session = await stripe.checkout.sessions.create(
        {
          mode: isCreditTopUp ? 'payment' : 'subscription',
          success_url,
          cancel_url,
          client_reference_id: authenticatedUserId,
          line_items: [lineItem],
          subscription_data: isCreditTopUp ? undefined : {},
          metadata: {},
          ...(isCreditTopUp
            ? { allow_promotion_codes: false }
            : {
                payment_method_collection: 'if_required',
                allow_promotion_codes: true,
              }),
        },
      );
      res.json(ok({ sessionURL: session.url }));
    },
  );
};

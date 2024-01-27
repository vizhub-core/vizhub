import express from 'express';
import { Gateways, err, ok } from 'gateways';
import { authenticationRequiredError } from 'gateways/src/errors';
import { getAuthenticatedUserId } from '../parseAuth0User';
import { getStripe } from './getStripe';
import { User } from 'entities';

const isValidDiscountCode = (discountCode: string) => {
  return (
    discountCode === 'WPIFREEYEAR' ||
    discountCode === 'WPIFREEYEAR2024'
  );
};

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
      const authenticatedUser: User = userResult.value.data;

      // For debugging.
      const alwaysAllowFreeTrial = false;

      // Only allow one free trial per user
      // by checking if user.stripeCustomerId is defined
      const trial_period_days =
        authenticatedUser.stripeCustomerId &&
        !alwaysAllowFreeTrial
          ? undefined
          : 7;

      const stripe = getStripe();

      // @ts-ignore
      const urlBase = req.headers.origin;

      // Redirect to the profile page after successful payment.
      // const success_url = `${urlBase}/${authenticatedUser.userName}`;
      const success_url = `${urlBase}/pricing`;
      const cancel_url = success_url;

      const { isMonthly } = req.body;

      let discountCode;
      if (
        req.body.discountCode &&
        isValidDiscountCode(req.body.discountCode)
      ) {
        discountCode = req.body.discountCode;
      }

      const price = isMonthly
        ? process.env.VIZHUB_PREMIUM_MONTHLY_STRIPE_PRICE_ID
        : process.env.VIZHUB_PREMIUM_ANNUAL_STRIPE_PRICE_ID;

      // https://stripe.com/docs/api/checkout/sessions/create#create_checkout_session-client_reference_id
      const session = await stripe.checkout.sessions.create(
        {
          mode: 'subscription',
          success_url,
          cancel_url,
          client_reference_id: authenticatedUserId,
          line_items: [
            {
              price,
              quantity: 1,
            },
          ],

          // Free trial
          // See https://stripe.com/docs/payments/checkout/free-trials
          subscription_data: {
            trial_settings: {
              end_behavior: {
                missing_payment_method: 'cancel',
              },
            },
            trial_period_days,
          },

          // Yes, we do always want to collect payment method.
          // By signing up, the user is agreeing to pay for the
          // service, so we want to collect payment method
          // regardless of whether they have a coupon or not.

          // If they have a coupon for one free year that comes with
          // joining the beta, then they will get a free year.

          // payment_method_collection: 'always',

          // Enable WPI signups without payment method
          payment_method_collection: discountCode
            ? 'if_required'
            : 'always',

          allow_promotion_codes: true,

          // discounts: discountCode
          //   ? [
          //       {
          //         coupon: discountCode,
          //       },
          //     ]
          //   : undefined,
        },
      );
      res.json(ok({ sessionURL: session.url }));
    },
  );
};

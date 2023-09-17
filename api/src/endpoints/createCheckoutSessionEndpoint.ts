import express from 'express';
import { err, ok } from 'gateways';
import { RecordAnalyticsEvents } from 'interactors';
import Stripe from 'stripe';
import { parseAuth0Sub, parseAuth0User } from '..';
import { authenticationRequiredError } from 'gateways/src/errors';

let stripe;

// console.log('Stripe', Stripe);

export const createCheckoutSession = ({
  app,
  gateways,
}) => {
  if (!stripe) {
    stripe = Stripe(process.env.VIZHUB_STRIPE_SECRET_KEY);
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

      // const sessionId = 'fake-session-id';

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

      // console.log('session');
      // console.log(session);

      res.json(ok({ sessionId: session.id }));
    },
  );

  // app.listen(8000, () => console.log('Running on port 8000'));

  // app.post('/api/stripe-webhooks', async (req, res) => {
  // console.log('reveiced request to Stripe Webhook');

  // // Verify the signature
  // const sig = req.headers['stripe-signature'];
  // const endpointSecret =
  //   process.env.STRIPE_WEBHOOK_SECRET;
  // let event;

  // try {
  //   event = stripe.webhooks.constructEvent(
  //     req.body,
  //     sig,
  //     endpointSecret,
  //   );
  // } catch (err) {
  //   console.log(err);
  //   return res
  //     .status(400)
  //     .send(`Webhook Error: ${err.message}`);
  // }

  // if (req.body && req.body.email) {
  //   const email = req.body.email;
  //   const result = await saveBetaProgramSignup({
  //     id: generateId(),
  //     email,
  //   });
  //   if (result.outcome !== 'success') {
  //     throw result.error;
  //   }

  //   await recordAnalyticsEvents({
  //     eventId: 'event.private-beta-email-submit',
  //   });

  //   res.send(ok('success'));
  // } else {
  //   res.send(err(missingParameterError('email')));
  // }

  // Send a 200 status code to Stripe
  // Explicitly set the 200 status code
  //   res.status(200);
  //   res.send('success');
  // });
};

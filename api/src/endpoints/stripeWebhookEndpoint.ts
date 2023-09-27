import express from 'express';

import { UserId } from 'entities';
import { getStripe } from './getStripe';
import { UpdateUserStripeId } from 'interactors';

// Critical for Stripe development - run this incantation
// stripe listen --forward-to localhost:3000/api/stripe-webhooks

// Click "Try it online" from this page to trigger Webhook
// https://stripe.com/docs/stripe-cli
// stripe trigger customer.subscription.created

// Docs for Stripe Webhooks
// https://stripe.com/docs/webhooks
export const stripeWebhookEndpoint = ({
  app,
  gateways,
}) => {
  const updateUserStripeId = UpdateUserStripeId(gateways);

  app.post(
    '/api/stripe-webhook',
    express.raw({ type: 'application/json' }),
    async (request, response) => {
      // Verify signature to prevent spoofing
      // See https://stripe.com/docs/webhooks#verify-official-libraries
      const sig = request.headers['stripe-signature'];
      const endpointSecret =
        process.env.VIZHUB_STRIPE_WEBHOOK_SIGNING_SECRET;
      let event;

      const stripe = getStripe();

      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          sig,
          endpointSecret,
        );
      } catch (err) {
        console.log(err);
        return response
          .status(400)
          .send(`Webhook Error: ${err.message}`);
      }

      // console.log(JSON.stringify(event, null, 2));

      // Handle the event
      switch (event.type) {
        case 'checkout.session.completed':
          const checkoutSessionCompleted =
            event.data.object;

          const userId: UserId =
            checkoutSessionCompleted.client_reference_id;

          const stripeCustomerId =
            checkoutSessionCompleted.customer;

          const result = await updateUserStripeId({
            userId,
            stripeCustomerId,
          });

          console.log('result', result);

          // // TODO update user with subscription
          // updateUserSubscription(userId, 'pro');
          break;
        case 'customer.subscription.created':
          const subscriptionCreated = event.data.object;
          console.log(
            'subscription created',
            subscriptionCreated,
          );

          // // TODO get user id from subscription
          // const userId = event.data.object.customer;

          // // TODO update user with subscription
          // updateUserSubscription(userId, 'pro');
          break;
        // ... handle other event types
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      // TODO get stripe ID and customer ID
      const stripeId = event.data.object.id;
      const customerId = event.data.object.customer;
      // TODO update user with stripe ID

      // Return a response to acknowledge receipt of the event
      response.json({ received: true });
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

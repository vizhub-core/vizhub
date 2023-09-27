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
      if (event.type === 'checkout.session.completed') {
        const checkoutSessionCompleted = event.data.object;

        const userId: UserId =
          checkoutSessionCompleted.client_reference_id;

        const stripeCustomerId =
          checkoutSessionCompleted.customer;

        const result = await updateUserStripeId({
          userId,
          stripeCustomerId,
        });

        if (result.outcome === 'failure') {
          console.log(
            'error updating user stripe id',
            result.error,
          );
        }
      }

      // Return a response to acknowledge receipt of the event
      response.json({ received: true });
    },
  );
};

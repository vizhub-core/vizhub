import express from 'express';
import { UserId } from 'entities';
import { getStripe } from './getStripe';
import { UpdateUserStripeId } from 'interactors';

const debug = false;

// Critical for Stripe development - run this incantation
// stripe listen --forward-to localhost:5173/api/stripe-webhook

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
        if (debug) {
          console.log(
            '[stripe-webhook] verifying signature',
          );
        }
        event = stripe.webhooks.constructEvent(
          request.body,
          sig,
          endpointSecret,
        );
        if (debug) {
          console.log(
            '[stripe-webhook] successfully verified signature!',
          );
        }
      } catch (err) {
        console.log(err);
        return response
          .status(400)
          .send(`Webhook Error: ${err.message}`);
      }

      // console.log(JSON.stringify(event, null, 2));
      if (debug) {
        console.log(
          '[stripe-webhook] received event',
          event,
        );
      }

      if (debug) {
        console.log('[stripe-webhook] event:', event);
      }

      // Upgrade via checkout session
      if (event.type == 'checkout.session.completed') {
        if (debug) {
          console.log(
            '[stripe-webhook] received checkout.session.completed event',
          );
        }

        const checkoutSessionCompleted = event.data.object;

        const userId: UserId =
          checkoutSessionCompleted.client_reference_id;

        const stripeCustomerId =
          checkoutSessionCompleted.customer;

        if (debug) {
          console.log(
            '[stripe-webhook] Updating user stripe id and plan',
            userId,
            stripeCustomerId,
          );
        }

        const upgradeResult = await updateUserStripeId({
          userId,
          stripeCustomerId,
          plan: 'premium',
        });

        if (upgradeResult.outcome === 'failure') {
          console.log(
            'error updating user stripe id',
            upgradeResult.error,
          );
        }
      }

      if (event.type === 'customer.subscription.updated') {
        if (debug) {
          console.log(
            '\n\n[stripe-webhook] received customer.subscription.updated event',
          );
          console.log(JSON.stringify(event, null, 2));
        }
      }

      // Downgrade via Billing Portal
      if (event.type === 'customer.subscription.deleted') {
        if (debug) {
          console.log(
            '\n\n[stripe-webhook] received customer.subscription.deleted event',
          );
          console.log(JSON.stringify(event, null, 2));
        }
        const subscriptionDeleted = event.data.object;

        const checkoutSessionCompleted = event.data.object;

        const userId: UserId =
          subscriptionDeleted.client_reference_id;

        const stripeCustomerId =
          checkoutSessionCompleted.customer;

        const result = await updateUserStripeId({
          userId,
          stripeCustomerId,
          plan: 'free',
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

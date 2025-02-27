import express from 'express';
import { FREE, User, UserId, userLock } from 'entities';
import { getStripe } from './getStripe';
import { UpdateUserStripeId } from 'interactors';
import { err, Gateways, Result } from 'gateways';

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
}: {
  app: any;
  gateways: Gateways;
}) => {
  const {
    getUserIdByStripeCustomerId,
    lock,
    getUser,
    saveUser,
  } = gateways;
  const updateUserStripeId = UpdateUserStripeId(gateways);

  app.post(
    '/api/stripe-webhook',
    express.raw({ type: 'application/json' }),
    async (request, response) => {
      // Check if the request is even for VizHub.
      // We may be getting requests from Stripe for other services,
      // such as Screenshot Genie, in which case we return 200 status to ignore.

      // 1) Read the raw text body (needed later for signature verification).
      const payload = await request.text();

      // 2) Peek at JSON to see if it matches Screenshot Genie at all.
      let parsedPayload: any;
      try {
        parsedPayload = JSON.parse(payload);
      } catch (err) {
        // If we can’t parse JSON, we don’t know what it is—but we also don’t want Stripe to keep retrying.
        debug &&
          console.log(
            '[Webhook action] JSON parse error; ignoring event',
          );
        return new Response(
          'Ignoring event for unrelated or invalid payload',
          {
            status: 200,
          },
        );
      }

      debug &&
        console.log(
          'product is ',
          parsedPayload?.data?.object?.metadata?.product,
        );
      const product =
        parsedPayload?.data?.object?.metadata?.product;
      if (product !== 'vizhub') {
        debug &&
          console.log(
            '[Webhook action] Ignoring event for unrelated product:',
            product,
          );
        return new Response(
          'Ignoring event for unrelated product',
          {
            status: 200,
          },
        );
      }

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

      // Handle completed checkout sessions (both subscriptions and one-time payments)
      if (event.type == 'checkout.session.completed') {
        if (debug) {
          console.log(
            '[stripe-webhook] received checkout.session.completed event',
          );
        }

        const checkoutSessionCompleted = event.data.object;
        const mode = checkoutSessionCompleted.mode;

        const userId: UserId =
          checkoutSessionCompleted.client_reference_id;

        const stripeCustomerId =
          checkoutSessionCompleted.customer;

        if (debug) {
          console.log(
            '[stripe-webhook] Processing checkout completion',
            { mode, userId, stripeCustomerId },
          );
        }

        if (mode === 'subscription') {
          // Handle subscription creation
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
        } else if (mode === 'payment') {
          // Handle credit top-up
          // TODO: Implement credit addition logic here
          debug &&
            console.log(
              '[stripe-webhook] Credit top-up completed',
              {
                userId,
                amount:
                  checkoutSessionCompleted.amount_total,
              },
            );

          debug &&
            console.log(
              "[stripe-webhook] Updating user's credit balance",
            );
          // Charge the user for the AI edit.
          await lock([userLock(userId)], async () => {
            // Get a fresh copy of the user just in case
            // it changed during the AI edit.
            const userResult = await getUser(userId);
            if (userResult.outcome === 'failure') {
              return response.send(err(userResult.error));
            }
            const user: User = userResult.value.data;

            user.creditBalance =
              user.creditBalance +
              checkoutSessionCompleted.amount_total;

            const saveUserResult = await saveUser(user);
            if (saveUserResult.outcome === 'failure') {
              return response.send(
                err(saveUserResult.error),
              );
            }

            debug &&
              console.log(
                "[stripe-webhook] Updated user's credit balance to " +
                  user.creditBalance,
              );
          });
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

        const stripeCustomerId: string =
          subscriptionDeleted.customer;

        const userIdResult: Result<UserId> =
          await getUserIdByStripeCustomerId(
            stripeCustomerId,
          );

        if (userIdResult.outcome === 'failure') {
          console.log(
            'error getting user id',
            userIdResult.error,
          );
          return;
        }
        const userId = userIdResult.value;

        const result = await updateUserStripeId({
          userId,
          stripeCustomerId,
          plan: FREE,
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

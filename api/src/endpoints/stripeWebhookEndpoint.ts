import express from 'express';
import {
  FREE,
  Plan,
  PREMIUM,
  PRO,
  User,
  UserId,
} from 'entities';
import { getNewStripe, getStripe } from './getStripe';
import { UpdateUserStripeId } from 'interactors';
import { err, Gateways, Result } from 'gateways';

const debug = true;

// Endpoint for handling Stripe webhooks.
// (Remember to run: stripe listen --forward-to localhost:5173/api/stripe-webhook)
export const stripeWebhookEndpoint = ({
  app,
  gateways,
}: {
  app: any;
  gateways: Gateways;
}) => {
  const { getUserIdByStripeCustomerId, getUser, saveUser } =
    gateways;
  const updateUserStripeId = UpdateUserStripeId(gateways);

  app.post(
    '/api/stripe-webhook',
    express.raw({ type: 'application/json' }),
    async (request, response) => {
      const sig = request.headers['stripe-signature'];
      const oldSecret =
        process.env.VIZHUB_STRIPE_WEBHOOK_SIGNING_SECRET;
      const newSecret =
        process.env
          .VIZHUB_NEW_STRIPE_WEBHOOK_SIGNING_SECRET;
      let event;
      let stripe;
      let usedNewSecret = false;

      // Try verifying with the old secret first.
      try {
        if (debug)
          console.log(
            '[stripe-webhook] Verifying with old secret...',
          );
        stripe = getStripe();
        event = stripe.webhooks.constructEvent(
          request.body,
          sig,
          oldSecret,
        );
        if (debug)
          console.log(
            '[stripe-webhook] Verified with old secret.',
          );
      } catch (oldErr) {
        try {
          if (debug)
            console.log(
              '[stripe-webhook] Old secret failed, trying new secret:',
              oldErr.message,
            );
          stripe = getNewStripe();
          event = stripe.webhooks.constructEvent(
            request.body,
            sig,
            newSecret,
          );
          usedNewSecret = true;
          if (debug)
            console.log(
              '[stripe-webhook] Verified with new secret.',
            );
        } catch (newErr) {
          console.error(
            '[stripe-webhook] Verification failed with both secrets:',
            newErr,
          );
          return response
            .status(400)
            .send(`Webhook Error: ${newErr.message}`);
        }
      }

      if (debug) {
        console.log(
          `[stripe-webhook] Using ${usedNewSecret ? 'new' : 'old'} Stripe instance.`,
        );
        console.log(
          '[stripe-webhook] Received event:',
          event.type,
        );
      }

      try {
        switch (event.type) {
          // Handle completed Checkout Sessions
          case 'checkout.session.completed': {
            const session = event.data.object;
            const mode = session.mode;
            const userId: UserId =
              session.client_reference_id;
            const stripeCustomerId = session.customer;

            if (debug)
              console.log(
                '[stripe-webhook] Checkout session completed:',
                { mode, userId, stripeCustomerId },
              );

            if (mode === 'subscription') {
              // For subscriptions (new or upgrades/downgrades)
              const stripeSubscriptionId =
                session.subscription;
              const subscription =
                await stripe.subscriptions.retrieve(
                  stripeSubscriptionId,
                );
              const subscriptionItems =
                subscription.items.data;

              // Map Stripe Price IDs to our internal plans
              const PLAN_MAPPING: Record<string, Plan> = {
                [process.env
                  .VIZHUB_PREMIUM_MONTHLY_STRIPE_PRICE_ID]:
                  PREMIUM,
                [process.env
                  .VIZHUB_PREMIUM_ANNUAL_STRIPE_PRICE_ID]:
                  PREMIUM,
                [process.env
                  .VIZHUB_PRO_MONTHLY_STRIPE_PRICE_ID]: PRO,
                [process.env
                  .VIZHUB_PRO_ANNUAL_STRIPE_PRICE_ID]: PRO,
              };

              let plan: Plan = FREE;
              for (const item of subscriptionItems) {
                if (PLAN_MAPPING[item.price.id]) {
                  plan = PLAN_MAPPING[item.price.id];
                  break;
                }
              }

              if (debug)
                console.log(
                  `[stripe-webhook] Updating user ${userId} to plan: ${plan}`,
                );

              const updateResult = await updateUserStripeId(
                {
                  userId,
                  stripeCustomerId,
                  plan,
                },
              );
              if (updateResult.outcome === 'failure') {
                console.error(
                  '[stripe-webhook] Error updating subscription:',
                  updateResult.error,
                );
                throw updateResult.error;
              } else {
                if (debug)
                  console.log(
                    `[stripe-webhook] Updated user ${userId} to plan: ${plan}`,
                  );
              }
            } else if (mode === 'payment') {
              // Handle one-time payments (e.g. credit top-ups)
              if (debug)
                console.log(
                  '[stripe-webhook] Processing credit top-up for user:',
                  userId,
                );
              const userResult = await getUser(userId);
              if (userResult.outcome === 'failure') {
                return response.send(err(userResult.error));
              }
              const user: User = userResult.value.data;
              user.creditBalance += session.amount_total;
              const saveResult = await saveUser(user);
              if (saveResult.outcome === 'failure') {
                return response.send(err(saveResult.error));
              }
              if (debug)
                console.log(
                  `[stripe-webhook] Updated user ${userId} credit balance to ${user.creditBalance}`,
                );
            }
            break;
          }

          // TODO Handle subscription creations (if not handled via checkout)
          // For now, these are all done via checkout sessions.
          // case 'customer.subscription.created': {

          // TODO Handle subscription updates (upgrades/downgrades via the Customer Portal)
          // case 'customer.subscription.updated': {

          // Handle subscription cancellations (downgrades via Billing Portal or direct cancellation)
          case 'customer.subscription.deleted': {
            const subscription = event.data.object;
            const stripeCustomerId = subscription.customer;
            const userIdResult: Result<UserId> =
              await getUserIdByStripeCustomerId(
                stripeCustomerId,
              );
            if (userIdResult.outcome === 'failure') {
              console.error(
                '[stripe-webhook] Error retrieving user ID on subscription deletion:',
                userIdResult.error,
              );
              break;
            }
            const userId = userIdResult.value;
            if (debug)
              console.log(
                `[stripe-webhook] Subscription deleted for user ${userId}. Setting plan to FREE.`,
              );
            const updateResult = await updateUserStripeId({
              userId,
              stripeCustomerId,
              plan: FREE,
            });
            if (updateResult.outcome === 'failure') {
              console.error(
                '[stripe-webhook] Error updating subscription on deletion:',
                updateResult.error,
              );
            }
            break;
          }

          // Handle invoice events (optional: to update user status or notify failures)
          case 'invoice.payment_failed': {
            const invoice = event.data.object;
            if (debug)
              console.log(
                `[stripe-webhook] Invoice payment failed for customer ${invoice.customer}.`,
              );
            // You might want to update your user's status here or notify them.
            break;
          }
          case 'invoice.paid': {
            const invoice = event.data.object;
            if (debug)
              console.log(
                `[stripe-webhook] Invoice paid for customer ${invoice.customer}.`,
              );
            // Optionally, re-activate suspended accounts if needed.
            break;
          }

          default: {
            if (debug)
              console.log(
                `[stripe-webhook] Unhandled event type: ${event.type}`,
              );
          }
        }
      } catch (processingError) {
        console.error(
          '[stripe-webhook] Error processing event:',
          processingError,
        );
        return response
          .status(500)
          .send(
            `Webhook Error: ${processingError.message}`,
          );
      }

      // Acknowledge receipt of the event.
      response.json({ received: true });
    },
  );
};

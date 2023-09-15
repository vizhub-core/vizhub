import express from 'express';
import { RecordAnalyticsEvents } from 'interactors';

export const stripeWebhookEndpoint = ({
  app,
  gateways,
}) => {
  const { saveBetaProgramSignup } = gateways;
  const recordAnalyticsEvents =
    RecordAnalyticsEvents(gateways);

  //  stripe listen --forward-to localhost:3000/api/stripe-webhooks

  // Docs for Stripe Webhooks
  // https://stripe.com/docs/webhooks/signatures

  // // Match the raw body to content type application/json
  // // If you are using Express v4 - v4.16 you need to use body-parser, not express, to retrieve the request body
  app.post(
    // '/webhook',
    '/api/stripe-webhook',
    express.json({ type: 'application/json' }),
    (request, response) => {
      console.log('reveiced request to Stripe Webhook');
      const event = request.body;

      // Handle the event
      switch (event.type) {
        case 'customer.subscription.created':
          const subscriptionCreated = event.data.object;
          console.log(
            'subscription created',
            subscriptionCreated,
          );
          // TODO get user id from subscription
          const userId = event.data.object.customer;
          // TODO update user with subscription
          updateUserSubscription(userId, 'pro');
          break;
        // ... handle other event types
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      // Return a response to acknowledge receipt of the event
      response.json({ received: true });
    },
  );

  // app.listen(8000, () => console.log('Running on port 8000'));

  app.post('/api/stripe-webhooks', async (req, res) => {
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
    res.status(200);
    res.send('success');
  });
};

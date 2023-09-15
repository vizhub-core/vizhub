import express from 'express';
import { RecordAnalyticsEvents } from 'interactors';
import Stripe from 'stripe';
const stripe = Stripe('sk_test_Isw5Gw3q2WQmSuuU7q1Knll5');

const session = await stripe.checkout.sessions.create({
  success_url: 'https://example.com/success',
  line_items: [
    { price: 'price_H5ggYwtDq4fbrJ', quantity: 2 },
  ],
  mode: 'payment',
});

export const createCheckoutSession = ({
  app,
  gateways,
}) => {
  app.post(
    '/api/create-checkout-session',
    express.json({ type: 'application/json' }),
    (request, response) => {
      console.log(
        'reveiced request to create checkout session',
      );
      // TODO create checkout session that has client_reference_id
      // const event = request.body;
      // const session = await stripe.checkout.sessions.create({
      //   success_url: 'https://example.com/success',
      //   line_items: [
      //     { price: 'price_H5ggYwtDq4fbrJ', quantity: 2 },
      //   ],
      //   mode: 'payment',
      //   client_reference_id: authenticatedUser.id,
      // });
      // response.json({ received: true });
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

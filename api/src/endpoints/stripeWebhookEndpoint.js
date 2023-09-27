import express from 'express';

import Stripe from 'stripe';
const stripe = Stripe(process.env.VIZHUB_STRIPE_SECRET_KEY);

// Critical for Stripe development - run this incantation
// stripe listen --forward-to localhost:3000/api/stripe-webhooks

// Click "Try it online" from this page to trigger Webhook
// https://stripe.com/docs/stripe-cli
// stripe trigger customer.subscription.created

// Docs for Stripe Webhooks
// https://stripe.com/docs/webhooks
export const stripeWebhookEndpoint = ({ app }) => {
  app.post(
    '/api/stripe-webhook',
    express.raw({ type: 'application/json' }),
    async (request, response) => {
      console.log('reveiced request to Stripe Webhook');

      // Verify signature to prevent spoofing
      // See https://stripe.com/docs/webhooks#verify-official-libraries
      const sig = request.headers['stripe-signature'];
      const endpointSecret =
        process.env.VIZHUB_STRIPE_WEBHOOK_SIGNING_SECRET;
      let event;

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

      // Example: customer.created
      //       Unhandled event type customer.created
      // reveiced request to Stripe Webhook
      // {
      //   "id": "evt_1NrQ1GEoQ28H0bHcZdsyUFLs",
      //   "object": "event",
      //   "api_version": "2020-03-02",
      //   "created": 1694976511,
      //   "data": {
      //     "object": {
      //       "id": "cus_OejUl3UdwXFD47",
      //       "object": "customer",
      //       "address": {
      //         "city": null,
      //         "country": "US",
      //         "line1": null,
      //         "line2": null,
      //         "postal_code": "12061",
      //         "state": null
      //       },
      //       "balance": 0,
      //       "created": 1694976510,
      //       "currency": "usd",
      //       "default_currency": "usd",
      //       "default_source": null,
      //       "delinquent": false,
      //       "description": null,
      //       "discount": null,
      //       "email": "curran.kelleher@gmail.com",
      //       "invoice_prefix": "E31D0B75",
      //       "invoice_settings": {
      //         "custom_fields": null,
      //         "default_payment_method": null,
      //         "footer": null,
      //         "rendering_options": null
      //       },
      //       "livemode": false,
      //       "metadata": {},
      //       "name": "Curran Kelleher",
      //       "next_invoice_sequence": 2,
      //       "phone": null,
      //       "preferred_locales": [
      //         "en-US"
      //       ],
      //       "shipping": null,
      //       "sources": {
      //         "object": "list",
      //         "data": [],
      //         "has_more": false,
      //         "total_count": 0,
      //         "url": "/v1/customers/cus_OejUl3UdwXFD47/sources"
      //       },
      //       "subscriptions": {
      //         "object": "list",
      //         "data": [
      //           {
      //             "id": "sub_1NrQ1DEoQ28H0bHcwwfsTA62",
      //             "object": "subscription",
      //             "application": null,
      //             "application_fee_percent": null,
      //             "automatic_tax": {
      //               "enabled": false
      //             },
      //             "billing_cycle_anchor": 1694976511,
      //             "billing_thresholds": null,
      //             "cancel_at": null,
      //             "cancel_at_period_end": false,
      //             "canceled_at": null,
      //             "cancellation_details": {
      //               "comment": null,
      //               "feedback": null,
      //               "reason": null
      //             },
      //             "collection_method": "charge_automatically",
      //             "created": 1694976511,
      //             "currency": "usd",
      //             "current_period_end": 1726598911,
      //             "current_period_start": 1694976511,
      //             "customer": "cus_OejUl3UdwXFD47",
      //             "days_until_due": null,
      //             "default_payment_method": "pm_1NrQ1CEoQ28H0bHc8ev42m3w",
      //             "default_source": null,
      //             "default_tax_rates": [],
      //             "description": null,
      //             "discount": null,
      //             "ended_at": null,
      //             "items": {
      //               "object": "list",
      //               "data": [
      //                 {
      //                   "id": "si_OejUj1iOrYA1Li",
      //                   "object": "subscription_item",
      //                   "billing_thresholds": null,
      //                   "created": 1694976511,
      //                   "metadata": {},
      //                   "plan": {
      //                     "id": "price_1NrAPHEoQ28H0bHcTkqS1yiD",
      //                     "object": "plan",
      //                     "active": true,
      //                     "aggregate_usage": null,
      //                     "amount": 20000,
      //                     "amount_decimal": "20000",
      //                     "billing_scheme": "per_unit",
      //                     "created": 1694916499,
      //                     "currency": "usd",
      //                     "interval": "year",
      //                     "interval_count": 1,
      //                     "livemode": false,
      //                     "metadata": {},
      //                     "nickname": null,
      //                     "product": "prod_OeTLfQbzm2m6Cs",
      //                     "tiers": null,
      //                     "tiers_mode": null,
      //                     "transform_usage": null,
      //                     "trial_period_days": null,
      //                     "usage_type": "licensed"
      //                   },
      //                   "price": {
      //                     "id": "price_1NrAPHEoQ28H0bHcTkqS1yiD",
      //                     "object": "price",
      //                     "active": true,
      //                     "billing_scheme": "per_unit",
      //                     "created": 1694916499,
      //                     "currency": "usd",
      //                     "custom_unit_amount": null,
      //                     "livemode": false,
      //                     "lookup_key": null,
      //                     "metadata": {},
      //                     "nickname": null,
      //                     "product": "prod_OeTLfQbzm2m6Cs",
      //                     "recurring": {
      //                       "aggregate_usage": null,
      //                       "interval": "year",
      //                       "interval_count": 1,
      //                       "trial_period_days": null,
      //                       "usage_type": "licensed"
      //                     },
      //                     "tax_behavior": "unspecified",
      //                     "tiers_mode": null,
      //                     "transform_quantity": null,
      //                     "type": "recurring",
      //                     "unit_amount": 20000,
      //                     "unit_amount_decimal": "20000"
      //                   },
      //                   "quantity": 1,
      //                   "subscription": "sub_1NrQ1DEoQ28H0bHcwwfsTA62",
      //                   "tax_rates": []
      //                 }
      //               ],
      //               "has_more": false,
      //               "total_count": 1,
      //               "url": "/v1/subscription_items?subscription=sub_1NrQ1DEoQ28H0bHcwwfsTA62"
      //             },
      //             "latest_invoice": "in_1NrQ1DEoQ28H0bHcVncO3ja9",
      //             "livemode": false,
      //             "metadata": {},
      //             "next_pending_invoice_item_invoice": null,
      //             "on_behalf_of": null,
      //             "pause_collection": null,
      //             "payment_settings": {
      //               "payment_method_options": null,
      //               "payment_method_types": null,
      //               "save_default_payment_method": "off"
      //             },
      //             "pending_invoice_item_interval": null,
      //             "pending_setup_intent": null,
      //             "pending_update": null,
      //             "plan": {
      //               "id": "price_1NrAPHEoQ28H0bHcTkqS1yiD",
      //               "object": "plan",
      //               "active": true,
      //               "aggregate_usage": null,
      //               "amount": 20000,
      //               "amount_decimal": "20000",
      //               "billing_scheme": "per_unit",
      //               "created": 1694916499,
      //               "currency": "usd",
      //               "interval": "year",
      //               "interval_count": 1,
      //               "livemode": false,
      //               "metadata": {},
      //               "nickname": null,
      //               "product": "prod_OeTLfQbzm2m6Cs",
      //               "tiers": null,
      //               "tiers_mode": null,
      //               "transform_usage": null,
      //               "trial_period_days": null,
      //               "usage_type": "licensed"
      //             },
      //             "quantity": 1,
      //             "schedule": null,
      //             "start_date": 1694976511,
      //             "status": "active",
      //             "tax_percent": null,
      //             "test_clock": null,
      //             "transfer_data": null,
      //             "trial_end": null,
      //             "trial_settings": {
      //               "end_behavior": {
      //                 "missing_payment_method": "create_invoice"
      //               }
      //             },
      //             "trial_start": null
      //           }
      //         ],
      //         "has_more": false,
      //         "total_count": 1,
      //         "url": "/v1/customers/cus_OejUl3UdwXFD47/subscriptions"
      //       },
      //       "tax_exempt": "none",
      //       "tax_ids": {
      //         "object": "list",
      //         "data": [],
      //         "has_more": false,
      //         "total_count": 0,
      //         "url": "/v1/customers/cus_OejUl3UdwXFD47/tax_ids"
      //       },
      //       "test_clock": null
      //     },
      //     "previous_attributes": {
      //       "currency": null,
      //       "default_currency": null
      //     }
      //   },
      //   "livemode": false,
      //   "pending_webhooks": 3,
      //   "request": {
      //     "id": "req_DOaRDZumDQGRYO",
      //     "idempotency_key": "c59276e1-0f64-4309-a53c-68e2c03ff92f"
      //   },
      //   "type": "customer.updated"
      // }
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

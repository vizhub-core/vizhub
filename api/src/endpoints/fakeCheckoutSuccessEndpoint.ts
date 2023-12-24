import express from 'express';
import { User } from 'entities';
import {
  Gateways,
  err,
  missingParameterError,
  ok,
} from 'gateways';

export const fakeCheckoutSuccessEndpoint = ({
  app,
  gateways,
}: {
  app: any;
  gateways: Gateways;
}) => {
  const { getUser, saveUser } = gateways;

  // Only enable this for local testing.
  if (import.meta.env.DEV) {
    app.post(
      '/api/fake-checkout-success',
      express.json(),
      async (
        req: express.Request,
        res: express.Response,
      ) => {
        // TODO Get the authenticated user from the request
        // to verify authorization.

        const { userId } = req.body;

        if (!userId) {
          return res.send(missingParameterError('userId'));
        }

        // TODO redlock

        const userResult = await getUser(userId);
        if (userResult.outcome === 'failure') {
          return res.send(err(userResult.error));
        }
        const user: User = userResult.value.data;

        user.plan = 'premium';
        // TODO stripe
        // user.stripeCustomerId = 'fake-stripe-customer-id';
        // user.stripeSubscriptionId = 'fake-stripe-subscription-id';
        // user.stripeSubscriptionItemId = 'fake-stripe-subscription-item-id';
        // user.stripeSubscriptionStatus = 'active';

        const saveUserResult = await saveUser(user);
        if (saveUserResult.outcome === 'failure') {
          return res.send(err(saveUserResult.error));
        }

        res.send(ok('success'));
      },
    );
  }
};

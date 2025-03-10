import express from 'express';
import { User, userLock } from 'entities';
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
  const { getUser, saveUser, lock } = gateways;

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

        lock([userLock(userId)], async () => {
          const userResult = await getUser(userId);
          if (userResult.outcome === 'failure') {
            return res.send(err(userResult.error));
          }
          const user: User = userResult.value.data;

          user.plan = 'premium';

          const saveUserResult = await saveUser(user);
          if (saveUserResult.outcome === 'failure') {
            return res.send(err(saveUserResult.error));
          }

          res.send(ok('success'));
        });
      },
    );
  }
};

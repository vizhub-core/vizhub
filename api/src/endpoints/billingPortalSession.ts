import express from 'express';
import { getStripe } from './getStripe';
import { getAuthenticatedUserId } from '../parseAuth0User';
import { Gateways } from 'gateways';
import { User } from 'entities';

const debug = true;

export const billingPortalSession = ({
  app,
  gateways,
}: {
  app: any;
  gateways: Gateways;
}) => {
  const { getUser } = gateways;
  app.post(
    '/api/create-billing-portal-session',
    express.json(),
    async (req, res) => {
      const userId = getAuthenticatedUserId(req);
      if (!userId) {
        return res
          .status(401)
          .send('User not authenticated');
      }

      // Retrieve the Stripe Customer ID for the authenticated user.
      const userResult = await getUser(userId);
      if (userResult.outcome === 'failure') {
        return res
          .status(500)
          .send('Internal Server Error');
      }
      const authenticatedUser: User = userResult.value.data;

      if (!authenticatedUser) {
        return res.status(404).send('User not found');
      }
      if (!authenticatedUser.stripeCustomerId) {
        return res
          .status(400)
          .send('User has no Stripe ID');
      }
      const stripeCustomerId =
        authenticatedUser.stripeCustomerId;

      if (debug) {
        console.log(
          '[billingPortalSession] stripeCustomerId: ' +
            stripeCustomerId,
        );
      }
      // @ts-ignore
      const urlBase = req.headers.origin;

      // Redirect to the profile page after
      const return_url = `${urlBase}/${authenticatedUser.userName}`;

      const stripe = getStripe();
      try {
        const session =
          await stripe.billingPortal.sessions.create({
            customer: stripeCustomerId,
            return_url,
          });
        res.json({ url: session.url });
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
    },
  );
};

import express from 'express';
import { getNewStripe, getStripe } from './getStripe';
import { getAuthenticatedUserId } from '../parseAuth0User';
import { Gateways, ok } from 'gateways';
import { User } from 'entities';

const debug = true;

export const billingPortalSessionEndpoint = ({
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

      // First we try with the old Stripe account, then we try with the new Stripe account
      // This helps us determine which account is tracking this customer during
      // the transition period
      const oldStripe = getStripe();
      const newStripe = getNewStripe();

      try {
        if (debug) {
          console.log(
            '[billingPortalSession] trying with old Stripe account',
          );
        }
        // Try to create session with old Stripe account first
        const session =
          await oldStripe.billingPortal.sessions.create({
            customer: stripeCustomerId,
            return_url,
          });
        res.json(ok({ sessionURL: session.url }));
      } catch (oldStripeErr) {
        if (debug) {
          console.log(
            '[billingPortalSession] old Stripe failed:',
            oldStripeErr.message,
          );
          console.log(
            '[billingPortalSession] trying with new Stripe account',
          );
        }

        // If the old Stripe account fails, try with the new one
        try {
          const session =
            await newStripe.billingPortal.sessions.create({
              customer: stripeCustomerId,
              return_url,
            });
          res.json(ok({ sessionURL: session.url }));
        } catch (newStripeErr) {
          // Both attempts failed
          console.error(
            'Billing portal creation failed with both Stripe accounts:',
            newStripeErr,
          );
          res.status(500).send('Internal Server Error');
        }
      }
    },
  );
};

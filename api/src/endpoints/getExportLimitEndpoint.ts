import express from 'express';
import { Gateways, err } from 'gateways';
import { getAuthenticatedUserId } from '../parseAuth0User';
import { authenticationRequiredError } from 'gateways/src/errors';
import {
  FREE,
  FREE_EXPORTS_PER_MONTH,
  User,
} from 'entities';

export const getExportLimitEndpoint = ({
  app,
  gateways,
}: {
  app: express.Express;
  gateways: Gateways;
}) => {
  const { getUser } = gateways;

  app.get(
    '/api/export-limit',
    express.json(),
    async (req, res) => {
      // Get authenticated user
      const authenticatedUserId =
        getAuthenticatedUserId(req);
      if (!authenticatedUserId) {
        res.json(err(authenticationRequiredError()));
        return;
      }

      // Get user data
      const userResult = await getUser(authenticatedUserId);
      if (userResult.outcome === 'failure') {
        res.json(userResult);
        return;
      }

      const user: User = userResult.value.data;

      // If user is not on free plan, they have unlimited exports
      if (user.plan !== FREE) {
        res.json({
          outcome: 'success',
          value: {
            plan: user.plan,
            unlimited: true,
            remainingExports: null,
            totalAllowed: null,
            currentMonthExports: null,
          },
        });
        return;
      }

      // For free plan users, calculate remaining exports
      const currentMonth = new Date()
        .toISOString()
        .slice(0, 7); // YYYY-MM format
      const currentMonthExports =
        user.exportCountByMonth?.[currentMonth] || 0;
      const remainingExports = Math.max(
        0,
        FREE_EXPORTS_PER_MONTH - currentMonthExports,
      );

      res.json({
        outcome: 'success',
        value: {
          plan: user.plan,
          unlimited: false,
          remainingExports,
          totalAllowed: FREE_EXPORTS_PER_MONTH,
          currentMonthExports,
        },
      });
    },
  );
};

import express from 'express';
import {
  Gateways,
  err,
  missingParameterError,
} from 'gateways';
import { getAuthenticatedUserId } from '../parseAuth0User';
import { UserId } from 'entities';
import { accessDeniedError } from 'gateways/src/errors';

// Requests suggestions for users based on partially typed usernames.
export const getUsersForTypeaheadEndpoint = ({
  app,
  gateways,
}: {
  app: express.Application;
  gateways: Gateways;
}) => {
  const { getUsersForTypeahead } = gateways;
  app.post(
    '/api/get-users-for-typeahead',
    express.json(),
    async (req, res) => {
      if (req.body) {
        const { query } = req.body;

        if (!query) {
          res.send(missingParameterError('query'));
          return;
        }

        const authenticatedUserId: UserId =
          getAuthenticatedUserId(req);

        // Guard against non-authenticated users.
        if (!authenticatedUserId) {
          res.send(
            err(
              accessDeniedError(
                'You must be logged in to perform this action.',
              ),
            ),
          );
          return;
        }

        res.send(await getUsersForTypeahead(query));
      }
    },
  );
};

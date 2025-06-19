import express from 'express';
import { UserId, VizNotification } from 'entities';
import { Gateways, err } from 'gateways';
import { getAuthenticatedUserId } from '../parseAuth0User';
import { authenticationRequiredError } from 'gateways/src/errors';

//Everything the UI needs to display the notifications UI is returned from this endpoint
export const getNotificationsEndpoint = ({
  app,
  gateways,
}: {
  app: any;
  gateways: Gateways;
}) => {
  const { getNotificationsByUserId, getComment, getInfo } =
    gateways;
  app.post(
    '/api/get-notifications',
    express.json(),
    async (req, res) => {
      if (req.body) {
        const {
          userId,
        }: {
          userId: UserId;
        } = req.body;

        // Need to be authenticated to add a comment.
        const authenticatedUserId =
          getAuthenticatedUserId(req);
        if (!authenticatedUserId) {
          res.json(err(authenticationRequiredError()));
          return;
        }

        // Validate author is logged in
        if (userId !== authenticatedUserId) {
          res.json(err(authenticationRequiredError()));
          return;
        }

        const getNotificationsByUserIdResult =
          await getNotificationsByUserId(userId);

        if (
          getNotificationsByUserIdResult.outcome ===
          'failure'
        ) {
          res.send(getNotificationsByUserIdResult);
          return;
        }

        const notifications =
          getNotificationsByUserIdResult.value;

        const commentsPromises = notifications.map(
          async (notification) =>
            getComment(notification.commentId),
        );

        const resourceTitlesPromises = notifications.map(
          async (notification) => getInfo(notification.id),
        );

        const comments = (
          await Promise.allSettled(commentsPromises)
        )
          .filter(
            (promiseResult) =>
              promiseResult.status === 'fulfilled',
          )
          .map((promiseResult) => promiseResult.value)
          .filter((result) => result.outcome === 'success')
          .map((result) => result.value.data);

        res.send(getNotificationsByUserIdResult);
      }
    },
  );
};

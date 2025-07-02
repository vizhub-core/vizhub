import express from 'express';
import { VizNotificationId } from 'entities';
import { Gateways, err } from 'gateways';
import { getAuthenticatedUserId } from '../parseAuth0User';
import { authenticationRequiredError } from 'gateways/src/errors';

export const markNotificationAsReadEndpoint = ({
  app,
  gateways,
}: {
  app: any;
  gateways: Gateways;
}) => {
  const {
    getNotification,
    saveNotification,
    decrementUserUnreadNotificationsCount,
  } = gateways;
  app.post(
    '/api/mark-notification-as-read',
    express.json(),
    async (req, res) => {
      if (req.body) {
        const {
          notificationId,
        }: {
          notificationId: VizNotificationId;
        } = req.body;

        // Need to be authenticated to mark a notification as read.
        const authenticatedUserId =
          getAuthenticatedUserId(req);
        if (!authenticatedUserId) {
          res.json(err(authenticationRequiredError()));
          return;
        }

        const notificationRequestResult =
          await getNotification(notificationId);

        if (
          notificationRequestResult.outcome === 'failure'
        ) {
          res.send(notificationRequestResult);
          return;
        }

        let notification =
          notificationRequestResult.value.data;

        // Validate author is logged in as the user who the notification is for
        if (notification.user !== authenticatedUserId) {
          res.json(err(authenticationRequiredError()));
          return;
        }

        notification.read = true;

        const saveNotificationResult =
          await saveNotification(notification);

        if (saveNotificationResult.outcome === 'failure') {
          res.send(saveNotificationResult);
          return;
        }

        const decrementResult =
          decrementUserUnreadNotificationsCount(
            notification.user,
          );

        res.send(decrementResult);
      }
    },
  );
};

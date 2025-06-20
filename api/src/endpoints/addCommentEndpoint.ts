import express from 'express';
import { Comment } from 'entities';
import { Gateways, err } from 'gateways';
import { getAuthenticatedUserId } from '../parseAuth0User';
import {
  authenticationRequiredError,
  VizHubErrorCode,
} from 'gateways/src/errors';
import {
  VizNotification,
  VizNotificationType,
} from 'entities';
import { generateVizId } from '@vizhub/viz-utils';

export const addCommentEndpoint = ({
  app,
  gateways,
}: {
  app: any;
  gateways: Gateways;
}) => {
  const {
    saveComment,
    saveNotification,
    getInfo,
    getMergeRequest,
    incrementUserUnreadNotificationsCount,
  } = gateways;
  app.post(
    '/api/add-comment',
    express.json(),
    async (req, res) => {
      if (req.body) {
        const {
          comment,
        }: {
          comment: Comment;
        } = req.body;

        // Need to be authenticated to add a comment.
        const authenticatedUserId =
          getAuthenticatedUserId(req);
        if (!authenticatedUserId) {
          res.json(err(authenticationRequiredError()));
          return;
        }

        // Validate author is logged in
        if (comment.author !== authenticatedUserId) {
          res.json(err(authenticationRequiredError()));
          return;
        }

        const saveCommentResult =
          await saveComment(comment);

        if (saveCommentResult.outcome == 'failure') {
          res.send(saveCommentResult);
          return;
        }

        const id = generateVizId();
        const getInfoResult = await getInfo(
          comment.resource,
        );

        //TODO verify that this works on comments that are for merge requests

        let recipientUserId = '';
        let notificationType: VizNotificationType =
          VizNotificationType.CommentOnYourViz;

        if (getInfoResult.outcome == 'failure') {
          if (
            getInfoResult.error.code ==
            VizHubErrorCode.resourceNotFound
          ) {
            const getMergeRequestResult =
              await getMergeRequest(comment.resource);
            if (
              getMergeRequestResult.outcome == 'failure'
            ) {
              res.send(getMergeRequestResult);
              return;
            }
            recipientUserId =
              getMergeRequestResult.value.data.author;
          } else {
            res.send(getInfoResult);
            return;
          }
        } else {
          recipientUserId = getInfoResult.value.data.owner;
        }

        const notification: VizNotification = {
          id: id,
          type: notificationType,
          user: recipientUserId,
          resource: comment.resource,
          created: comment.created,
          read: false,
          commentId: comment.id,
        };
        const saveNotificationResult =
          await saveNotification(notification);

        if (saveNotificationResult.outcome === 'failure') {
          res.send(saveNotificationResult);
          return;
        }

        const incrementResult =
          incrementUserUnreadNotificationsCount(
            recipientUserId,
          );

        res.send(incrementResult);
      }
    },
  );
};

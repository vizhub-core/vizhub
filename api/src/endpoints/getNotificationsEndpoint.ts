import express from 'express';
import { CommentId, UserId, Comment } from 'entities';
import { Gateways, Result, err } from 'gateways';
import { getAuthenticatedUserId } from '../parseAuth0User';
import { authenticationRequiredError } from 'gateways/src/errors';
import { VizId } from '@vizhub/viz-types';
import { VizNotificationRequestResult } from 'entities/src/Notifications';

//Everything the UI needs to display the notifications UI is returned from this endpoint
export const getNotificationsEndpoint = ({
  app,
  gateways,
}: {
  app: any;
  gateways: Gateways;
}) => {
  const {
    getNotificationsByUserId,
    getComment,
    getInfo,
    getUser,
  } = gateways;
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

        // Need to be authenticated to get notifications.
        const authenticatedUserId =
          getAuthenticatedUserId(req);
        if (!authenticatedUserId) {
          res.json(err(authenticationRequiredError()));
          return;
        }

        // Validate relevant user is logged in
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
          getNotificationsByUserIdResult.value
            .map((snapshot) => snapshot.data)
            .filter((notification) => !notification.read);

        const commentsPromises = notifications.map(
          async (notification) =>
            await getComment(notification.commentId),
        );

        const resourcePromises = notifications.map(
          async (notification) =>
            await getInfo(notification.resource),
        );

        const commentsArray = (
          await Promise.allSettled(commentsPromises)
        )
          .filter(
            (promiseResult) =>
              promiseResult.status === 'fulfilled',
          )
          .map((promiseResult) => promiseResult.value)
          .filter((result) => result.outcome === 'success');

        const comments = commentsArray.reduce(
          (map, result) => {
            map.set(
              result.value.data.id,
              result.value.data,
            );
            return map;
          },
          new Map<CommentId, Comment>(),
        );

        const commentAuthorsUserPromises =
          commentsArray.map(
            async (comment) =>
              await getUser(comment.value.data.author),
          );

        const commentAuthorsUserArray = (
          await Promise.allSettled(
            commentAuthorsUserPromises,
          )
        )
          .filter(
            (promiseResult) =>
              promiseResult.status === 'fulfilled',
          )
          .map((promiseResult) => promiseResult.value)
          .filter((result) => result.outcome === 'success');

        const commentAuthors =
          commentAuthorsUserArray.reduce((map, result) => {
            map.set(
              result.value.data.id,
              result.value.data.userName,
            );
            return map;
          }, new Map<UserId, string>());

        const commentAuthorImages =
          commentAuthorsUserArray.reduce((map, result) => {
            map.set(
              result.value.data.id,
              result.value.data.picture,
            );
            return map;
          }, new Map<UserId, string>());

        const resourceTitles = (
          await Promise.allSettled(resourcePromises)
        )
          .filter(
            (promiseResult) =>
              promiseResult.status === 'fulfilled',
          )
          .map((promiseResult) => promiseResult.value)
          .filter((result) => result.outcome === 'success')
          .reduce((map, result) => {
            map.set(
              result.value.data.id,
              result.value.data.title,
            );
            return map;
          }, new Map<VizId, string>());

        const resourceOwners = (
          await Promise.allSettled(resourcePromises)
        )
          .filter(
            (promiseResult) =>
              promiseResult.status === 'fulfilled',
          )
          .map((promiseResult) => promiseResult.value)
          .filter((result) => result.outcome === 'success')
          .reduce((map, result) => {
            map.set(
              result.value.data.id,
              result.value.data.owner,
            );
            return map;
          }, new Map<VizId, string>());

        const resourceAuthorUsernamesPromises = (
          await Promise.allSettled(resourcePromises)
        )
          .filter(
            (promiseResult) =>
              promiseResult.status === 'fulfilled',
          )
          .map((promiseResult) => promiseResult.value)
          .filter((result) => result.outcome === 'success')
          .map(
            async (result) =>
              await getUser(result.value.data.owner),
          );

        const resourceOwnerUsernames = (
          await Promise.allSettled(
            resourceAuthorUsernamesPromises,
          )
        )
          .filter(
            (promiseResult) =>
              promiseResult.status === 'fulfilled',
          )
          .map((promiseResult) => promiseResult.value)
          .filter((result) => result.outcome === 'success')
          .reduce((map, result) => {
            map.set(
              result.value.data.id,
              result.value.data.userName,
            );
            return map;
          }, new Map<UserId, string>());

        const result: Result<VizNotificationRequestResult> =
          {
            outcome: 'success',
            value: {
              notifications,
              comments: Object.fromEntries(comments),
              commentAuthors:
                Object.fromEntries(commentAuthors),
              commentAuthorImages: Object.fromEntries(
                commentAuthorImages,
              ),
              resourceTitles:
                Object.fromEntries(resourceTitles),
              resourceOwnerUsernames: Object.fromEntries(
                resourceOwnerUsernames,
              ),
              resourceOwners:
                Object.fromEntries(resourceOwners),
            },
          };

        res.send(result);
      }
    },
  );
};

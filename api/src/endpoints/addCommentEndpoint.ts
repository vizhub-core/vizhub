import express from 'express';
import { Comment } from 'entities';
import { Gateways, err } from 'gateways';
import { getAuthenticatedUserId } from '../parseAuth0User';
import { authenticationRequiredError } from 'gateways/src/errors';

export const addCommentEndpoint = ({
  app,
  gateways,
}: {
  app: any;
  gateways: Gateways;
}) => {
  const { saveComment } = gateways;
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

        res.send(saveCommentResult);
      }
    },
  );
};
